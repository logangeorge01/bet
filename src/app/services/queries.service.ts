import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bet, Event } from '../types';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class QueriesService {
   allBets$: Observable<Bet[]>;
   filterBets$: Observable<Bet[]>;
   userBets$: Observable<Bet[]>;
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
         map(betsSS => betsSS.map(betSS => betSS.payload.doc.data() as Bet))
      );
   }
   /*getBetsFromCat(lvl: string, cat: string, status = 0) {
      const cref = this.db.collection('allbets', ref => ref.where(lvl, '==', cat).where('status', '==', status).orderBy('dtCreated'));
      this.allBets$ = cref.snapshotChanges().pipe(
         map(betsSS => betsSS.map(betSS => betSS.payload.doc.data() as Bet))
      );
   }*/
   getBetsFromCat(lvl: string, cat: string) {
      this.filterBets$ = this.allBets$.pipe(
         map(bets => bets.filter(bet => bet[lvl] === cat))
      );
   }
   getUsersBets(uid: string) {
      // this.userBets$ = this.db.collection('allbets', ref => ref.where('')

   }
   placeBet(bet: Bet): Promise<any> {
      return this.db.collection('allbets').add(bet).then(betref => {
         const userref = this.db.collection('users').doc(bet.creator.uid);
         userref.update({
            balance: firestore.FieldValue.increment(-1 * bet.creator.amount)
         });
         userref.collection('bets').add({betID: betref.id});
      });
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
