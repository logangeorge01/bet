import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bet, Event, UserBet, Withdraw, SiteData } from '../types';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class QueriesService {
   allBets$: Observable<Bet[]>;
   userBets: {
      bet: Bet,
      cora: string,
      open: boolean
   }[];
   events$: Observable<Event[]>;
   filterEvents$: Observable<Event[]>;
   cats: any;
   siteData$: Observable<SiteData>;
   withdrawals$: Observable<Withdraw[]>;

   constructor(
      private db: AngularFirestore
   ) {
      this.getCats();
   }

   getAllBets() {
      const cref = this.db.collection('allbets', ref => ref.where('open', '==', true).orderBy('dtCreated', 'desc').limit(50));
      this.allBets$ = cref.snapshotChanges().pipe(
         map(betsSS => betsSS.map(betSS => ({...(betSS.payload.doc.data() as DocumentData), betID: betSS.payload.doc.id} as Bet)))
      );
   }
   getBetsFromCat(lvl: string, cat: string) {
      this.allBets$ = this.allBets$.pipe(
         map(bets => bets.filter(bet => bet[lvl] === cat))
      );
   }
   getUsersBets(uid: string) {
      this.userBets = [];
      this.db.collection('users').doc(uid).collection('bets').get().toPromise().then(ubetsSS =>
         ubetsSS.docs.map(ubetSS => {
            const ubet = ubetSS.data() as UserBet;
            this.db.collection('allbets').doc(ubet.betID).get().toPromise().then(betSS =>
               this.userBets.push({
                  bet: betSS.data() as Bet,
                  cora: ubet.cora,
                  open: ubet.open
               })
            );
         })
      );
   }
   placeBet(bet: Bet): Promise<any> {
      return this.db.collection('allbets').add(bet).then(betref => {
         const userref = this.db.collection('users').doc(bet.creator.uid);
         userref.update({
            balance: firestore.FieldValue.increment(-bet.creator.amount)
         });
         userref.collection('bets').add({
            betID: betref.id,
            cora: 'creator'
         } as UserBet);
      });
   }
   acceptBet(bet: Bet): Promise<any> {
      const uref = this.db.collection('users').doc(bet.acceptor.uid);
      return Promise.all([
         uref.collection('bets').add({
            betID: bet.betID,
            cora: 'acceptor'
         } as UserBet),
         uref.update({balance: firestore.FieldValue.increment(-bet.acceptor.amount)}),
         this.db.collection('allbets').doc(bet.betID).update({'acceptor.uid': bet.acceptor.uid, open: false})
      ]);
   }

   getAllEvents() {
      this.events$ = this.db.collection('events', ref => ref.where('current', '==', true).orderBy('estResolve')).get().pipe(
         map(eventsSS => eventsSS.docs.map(eventSS => ({...eventSS.data(), eventID: eventSS.id} as Event)))
      );
   }
   getEventsFromCat(lvl: string, cat: string) {
      this.filterEvents$ = this.events$.pipe(
         map(events => events.filter(event => event[lvl] === cat))
      );
   }
   createEvent(event: Event): Promise<any> {
      return this.db.collection('events').add(event);
   }
   resolveEvent(eventID: string, sidename: string): Promise<any> {
      const cref = this.db.collection('allbets', ref => ref.where('eventID', '==', eventID));
      return cref.get().toPromise().then(betsSS => {
         const batch = this.db.firestore.batch();
         betsSS.docs.forEach(betSS => {
            const b = (betSS.data() as Bet);
            if (b.open) {
               const uref = this.db.collection('users').doc(b.creator.uid).ref;
               batch.update(uref, {balance: firestore.FieldValue.increment(b.creator.amount)});
               batch.update(betSS.ref, {open: false}); // maybe delete open bets
            } else {
               const dataref = this.db.collection('data').doc('data').ref;
               const winner = sidename === b.creator.side ? 'creator' : 'acceptor';
               const uref = this.db.collection('users').doc(b[winner].uid).ref;
               const fee = Math.round((((b.pot - b[winner].amount) * .1) + Number.EPSILON) * 100) / 100;
               batch.update(uref, {balance: firestore.FieldValue.increment(b.pot - fee)});
               batch.update(dataref, {ourMoney: firestore.FieldValue.increment(fee), siteTotal: firestore.FieldValue.increment(-fee)});
            }
         });
         return Promise.resolve([
            this.db.collection('events').doc(eventID).update({current: false}),
            batch.commit()
         ]);
      });
   }

   getCats() {
      this.db.collection('cats').doc('cats').get().toPromise().then(catdoc => this.cats = catdoc.data().cats);
   }

   addFunds(uname: string, amount: number): Promise<any> {
      return this.checkUname(uname).then(exists => {
         if (exists) {
            return Promise.all([
               this.db.collection('users', ref => ref.where('username', '==', uname)).get().toPromise().then(docSS =>
                  docSS.docs[0].ref.update({balance: firestore.FieldValue.increment(amount)})
               ),
               this.db.collection('data').doc('data').update({siteTotal: firestore.FieldValue.increment(amount)})
            ]);
         }
      });
   }

   checkUname(uname: string): Promise<boolean> {
      return this.db.collection('usernames', ref => ref.where('username', '==', uname)).get().toPromise().then(docsSS => !docsSS.empty);
   }

   getWithdrawals() {
      this.withdrawals$ = this.db.collection('withdrawals', ref => ref.where('resolved', '==', false)).get().pipe(
         map(docsSS => docsSS.docs.map(docSS => ({...docSS.data(), wdID: docSS.id} as Withdraw)))
      );
   }
   closeWithdrawal(wdID: string): Promise<any> {
      return this.db.collection('withdrawals').doc(wdID).update({resolved: true});
   }
   withdrawFromUser(wd: Withdraw): Promise<any> {
      return Promise.all([
         this.db.collection('data').doc('data').update({siteTotal: firestore.FieldValue.increment(-wd.amount)}),
         this.db.collection('users').doc(wd.uid).update({balance: firestore.FieldValue.increment(-wd.amount)}),
         this.db.collection('withdrawals').add(wd)
      ]);
   }

   getSiteData() {
      this.siteData$ = this.db.collection('data').doc('data').get().pipe(
         map(docSS => docSS.data() as SiteData)
      );
   }
}
