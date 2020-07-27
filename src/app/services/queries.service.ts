import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bet, Event } from '../types';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QueriesService {
   allBets$: Observable<Bet[]>;
   cats: any;
   events$: Observable<Event[]>;

   constructor(
      private db: AngularFirestore
   ) {
      this.getCats();
   }

   getAllBets() {
      this.allBets$ = this.db.collection('allbets', ref => ref.orderBy('dtCreated').limit(50)).snapshotChanges().pipe(
         map(betsSS => betsSS.map(betSS => betSS.payload.doc.data() as Bet))
      );
   }

   getBetsFromCat(lvl: string, cat: string, status = 0): Observable<Bet[]> {
      const cref = this.db.collection('allbets', ref => ref.where(lvl, '==', cat).where('status', '==', status).orderBy('dtCreated'));
      return cref.snapshotChanges().pipe(
         map(betsSS => betsSS.map(betSS => betSS.payload.doc.data() as Bet))
      );
   }

   getAllEvents() {
      this.events$ = this.db.collection('events', ref => ref.orderBy('estResolve')).get().pipe(
         map(eventsSS => eventsSS.docs.map(eventSS => ({...eventSS.data(), eventID: eventSS.id} as Event)))
      );
   }

   getCats() {
      this.db.collection('cats').doc('cats').get().toPromise().then(catdoc => this.cats = catdoc.data().cats);
   }
}
