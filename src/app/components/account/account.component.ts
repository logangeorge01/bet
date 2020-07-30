import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { QueriesService } from 'src/app/services/queries.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

   constructor(
      private auth: AuthService,
      private router: Router,
      private qs: QueriesService
   ) { }

   ngOnInit() {
      this.auth.user$.subscribe(user => this.qs.getUsersBets(user.uid));
   }

   /*getUserBets(uid: string) {
      this.qs.getUsersBets(uid);
   }*/

   gohome() {
      this.router.navigate(['']);
   }

   logout() {
      this.auth.signOut();
   }
}
