import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Bet, Event, User } from 'src/app/types';
import { QueriesService } from 'src/app/services/queries.service';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   notplacingbet = true;

   selevent: Event;
   cat1: string;
   cat2: string;
   cat3: string;
   csideindexp1: number;
   camount = 5;

   filter1: string;
   filter2: string;
   filter3: string;

   constructor(
      public auth: AuthService,
      private router: Router,
      public qs: QueriesService
   ) { }

   ngOnInit() {
      this.qs.getAllBets();
      this.auth.user$.subscribe(user => {
         if (user.balance === 0) {
            alert('Add funds on your account page so you can bet!');
         }
      });
   }

   gotoaccount() {
      this.router.navigate(['account']);
   }

   gotoadmin() {
      this.router.navigate(['admin']);
   }

   startNewBet() {
      this.qs.getAllEvents();
      this.notplacingbet = false;
   }

   placeNewBet(u: User) {
      const se = this.selevent;
      const pot = (this.camount * this.selevent.sides[this.csideindexp1 - 1].decOdds);
      const bet = {
         event: se.name,
         eventID: se.eventID,
         cat1: se.cat1,
         cat2: se.cat2,
         cat3: se.cat3,
         creator: {
            uid: u.uid,
            username: u.username,
            amount: this.camount,
            side: se.sides[this.csideindexp1 - 1].name
         },
         acceptor: {
            amount: pot - this.camount,
            side: se.sides[2 - this.csideindexp1].name
         },
         pot,
         open: true,
         dtCreated: firestore.Timestamp.now()
      } as Bet;
      this.qs.placeBet(bet).then(() => {
         this.notplacingbet = true;
         alert('Success! Your bet was placed.');
      });
   }

   clearOpts() {
      this.cat1 = null;
      this.cat2 = null;
      this.cat3 = null;
      this.selevent = null;
      this.csideindexp1 = null;
   }

   getCatOpts(c3: string) {
      this.cat3 = c3;
      this.qs.getEventsFromCat('cat3', c3);
   }

   changeAmount(delta: number) {
      this.camount += delta;
   }

   acceptBet(bet: Bet, user: User) {
      if (bet.acceptor.amount > user.balance) {
         alert('Insufficient funds. You can add more from your account page.');
         return;
      }
      bet.acceptor.uid = user.uid;
      bet.open = false;
      this.qs.acceptBet(bet).then(() => alert('Bet accepted successfully. You can view it on your account page.'));
   }

   clearFilters() {
      this.filter1 = null;
      this.filter2 = null;
      this.filter3 = null;
      this.qs.getAllBets();
   }

   handleFilter(lvl: number, cat: string) {
      this[`filter${lvl}`] = cat;
      this.qs.getBetsFromCat(`cat${lvl}`, cat);
   }

}
