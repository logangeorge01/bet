import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bet, Event, UserBet } from '../types';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class QueriesService {
   allBets$: Observable<Bet[]>;
   userBets: {
      bet: Bet,
      cora: string
   }[];
   events$: Observable<Event[]>;
   filterEvents$: Observable<Event[]>;
   cats: any;

   constructor(
      private db: AngularFirestore
   ) {
      this.getCats();
   }

   getAllBets(status = 0) {
      const cref = this.db.collection('allbets', ref => ref.where('status', '==', status).orderBy('dtCreated', 'desc').limit(50));
      this.allBets$ = cref.snapshotChanges().pipe(
         map(betsSS => betsSS.map(betSS => ({...(betSS.payload.doc.data() as DocumentData), betID: betSS.payload.doc.id} as Bet)))
      );
   }
   /*getBetsFromCat(lvl: string, cat: string, status = 0) {
      const cref = this.db.collection('allbets', ref => ref.where(lvl, '==', cat).where('status', '==', status).orderBy('dtCreated'));
      this.allBets$ = cref.snapshotChanges().pipe(
         map(betsSS => betsSS.map(betSS => betSS.payload.doc.data() as Bet))
      );
   }*/
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
                  cora: ubet.cora
               })
            );
         })
      );
   }
   placeBet(bet: Bet): Promise<any> {
      return this.db.collection('allbets').add(bet).then(betref => {
         const userref = this.db.collection('users').doc(bet.creator.uid);
         userref.update({
            balance: firestore.FieldValue.increment(-1 * bet.creator.amount)
         });
         userref.collection('bets').add({
            betID: betref.id,
            cora: 'creator'
         } as UserBet);
      });
   }
   acceptBet(bet: Bet) {
      this.db.collection('users').doc(bet.acceptor.uid).collection('bets').add({
         betID: bet.betID,
         cora: 'acceptor'
      } as UserBet);
      this.db.collection('allbets').doc(bet.betID).update({status: 1});

      // FINISH
   }

   getAllEvents() {
      this.events$ = this.db.collection('events', ref => ref.orderBy('estResolve')).get().pipe(
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

   getCats() {
      this.db.collection('cats').doc('cats').get().toPromise().then(catdoc => this.cats = catdoc.data().cats);
   }

   addFunds(uname: string, amount: number): Promise<any> {
      return this.checkUname(uname).then(exists => {
         if (exists) {
            this.db.collection('users', ref => ref.where('username', '==', uname)).get().toPromise().then(docSS =>
               docSS.docs[0].ref.update({balance: firestore.FieldValue.increment(amount)})
            );
         }
      });
   }

   checkUname(uname: string): Promise<boolean> {
      return this.db.collection('usernames', ref => ref.where('username', '==', uname)).get().toPromise().then(docsSS => !docsSS.empty);
   }
}
