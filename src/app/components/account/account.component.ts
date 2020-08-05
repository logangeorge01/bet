import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { QueriesService } from 'src/app/services/queries.service';
import { Withdraw } from 'src/app/types';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
   withOpen = false;

   wdMethod: string;
   wdUsername: string;
   wdAmount: number;

   constructor(
      private auth: AuthService,
      private router: Router,
      private qs: QueriesService
   ) { }

   ngOnInit() {
      this.auth.user$.subscribe(user => this.qs.getUsersBets(user.uid));
   }

   gohome() {
      this.router.navigate(['']);
   }

   logout() {
      this.auth.signOut();
   }

   checkWithdraw() {
      return this.wdMethod && this.wdUsername && this.wdAmount;
   }

   withdraw(uid: string) {
      const wd = {
         uid,
         amount: Math.round((this.wdAmount + Number.EPSILON) * 100) / 100,
         method: this.wdMethod,
         methodUname: this.wdUsername,
         resolved: false,
         dtRequested: firestore.Timestamp.now()
      } as Withdraw;
      this.qs.withdrawFromUser(wd).then(() => {
         alert('Success! You\'ll receive your money soon.');
         this.withOpen = false;
      });
   }
}
