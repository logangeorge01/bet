import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

   constructor(
      private auth: AuthService,
      private router: Router,
      private db: AngularFirestore
   ) { }

   ngOnInit() {
   }

   gohome() {
      this.router.navigate(['']);
   }

   logout() {
      this.auth.signOut();
   }
}
