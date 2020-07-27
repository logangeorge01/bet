import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { QueriesService } from 'src/app/services/queries.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from 'src/app/types';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
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
      private auth: AuthService,
      private qs: QueriesService,
      private db: AngularFirestore,
      private router: Router
   ) { }

   ngOnInit() {
      this.qs.getAllEvents();
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
      this.db.collection('events').add(newEvent).then(() => this.notcreating = true);
   }

   gohome() {
      this.router.navigate(['']);
   }

}
