import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Bet, Event, User } from 'src/app/types';
import { QueriesService } from 'src/app/services/queries.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   notplacingbet = true;

   selevent: Event;

   constructor(
      private auth: AuthService,
      private router: Router,
      private qs: QueriesService,
   ) { }

   ngOnInit() {
      this.qs.getAllBets();
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
      /*const bet = {
         event: 3
      } as Bet;*/

      /*const se = this.selevent;
      const bet = {
         event: se.name,
         eventID: se.eventID,
         cat1: se.cat1,
         cat2: se.cat2,
         cat3: se.cat3,
         creator: {
            uid: u.uid,
            username: u.username,
            amount:,
            side:
         },
         acceptor: {
            amount:,
            side:
         },
         pot:,
         status:,
         dtCreated:
      } as Bet;*/

      console.log(this.selevent);
   }

}
