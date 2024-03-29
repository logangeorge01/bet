import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { QueriesService } from 'src/app/services/queries.service';
import { Event } from 'src/app/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
   addToUsername: string;
   addAmount: number;

   notcreating = true;

   eventname: string;
   side1name: string;
   side1odds: number;
   side2name: string;
   side2odds: number;
   estres: string;
   cat1: string;
   cat2: string;
   cat3: string;

   constructor(
      public auth: AuthService,
      public qs: QueriesService,
      private router: Router
   ) { }

   ngOnInit() {
      this.loadEvs();
      this.qs.getSiteData();
      this.qs.getWithdrawals();
   }

   createMarket() {
      const newEvent = {
         name: this.eventname,
         sides: [{
            name: this.side1name,
            decOdds: Math.round((this.side1odds + Number.EPSILON) * 100) / 100
         }, {
            name: this.side2name,
            decOdds: Math.round((this.side2odds + Number.EPSILON) * 100) / 100
         }],
         estResolve: new Date(this.estres),
         current: true,
         cat1: this.cat1,
         cat2: this.cat2,
         cat3: this.cat3
      } as Event;
      this.qs.createEvent(newEvent).then(() => {
         this.loadEvs();
         // this.clearCreate();
      });
   }

   /*clearCreate() {
      // might actually be easier not to clear
      this.notcreating = true;
      this.eventname = null;
      this.side1name = null;
      this.side1odds = null;
      this.side2name = null;
      this.side2odds = null;
      this.estres = null;
      this.cat1 = null;
      this.cat2 = null;
      this.cat3 = null;
   }*/

   gohome() {
      this.router.navigate(['']);
   }

   loadEvs() {
      this.qs.getAllEvents();
   }

   addFunds() {
      this.qs.addFunds(this.addToUsername, this.addAmount).then(() => {
         this.addToUsername = null;
         this.addAmount = null;
         this.qs.getSiteData();
      });
   }

   clearOpts() {
      this.cat1 = null;
      this.cat2 = null;
      this.cat3 = null;
   }

   closeWD(wdID: string) {
      this.qs.closeWithdrawal(wdID).then(() => this.qs.getWithdrawals());
   }

   resolve(eventID: string, sidename: string) {
      this.qs.resolveEvent(eventID, sidename).then(() => {
         alert('Event resolved successfully');
         setTimeout(() => {
            this.qs.getSiteData();
            this.loadEvs();
         }, 1000);
      });
   }
}
