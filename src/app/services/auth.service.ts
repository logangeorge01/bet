import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth, firestore } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../types';

@Injectable({ providedIn: 'root' })
export class AuthService {
   user$: Observable<User>;

   constructor(
      private afAuth: AngularFireAuth,
      private db: AngularFirestore,
      private router: Router
   ) {
      this.user$ = this.afAuth.authState.pipe(
         switchMap(user => user ? this.db.collection('users').doc(user.uid).valueChanges() : of(null))
      ) as any;
   }

   login(email: string, password: string) {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
   }

   signUp(username: string, email: string, password: string) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(cred => {
         const user = {
            uid: cred.user.uid,
            username,
            email: cred.user.email,
            balance: 0,
            admin: false
         } as User;
         this.db.collection('users').doc(cred.user.uid).set(user, { merge: true });
         this.db.collection('usernames').add({username});
      });
   }

   async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['login']);
   }
}
