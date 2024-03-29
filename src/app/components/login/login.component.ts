import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { QueriesService } from 'src/app/services/queries.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   onLogin = true;

   loginemail: string;
   loginpassword: string;
   uname: string;
   email: string;
   password: string;
   confpassword: string;

   constructor(
      private auth: AuthService,
      private router: Router,
      private qs: QueriesService
   ) { }

   ngOnInit() {
   }

   login() {
      if (!this.loginemail) {
         alert('Please enter your username');
      } else if (!this.loginpassword) {
         alert('Please enter your password');
      } else {
         this.auth.login(this.loginemail, this.loginpassword).then(() =>
            this.router.navigate([''])).catch(() => alert('Password incorrect'));
      }
   }

   signup() {
      if (!this.uname) {
         alert('You must create a username');
      } else if (!this.email) {
         alert('You must enter your email');
      } else if (!this.password) {
         alert('You must enter a password');
      } else if (!this.confpassword) {
         alert('You must confirm your password');
      } else if (this.password !== this.confpassword) {
         alert('Passwords must match');
      } else {
         this.qs.checkUname(this.uname).then(exists => {
            if (exists) {
               alert('Username already exists');
            } else {
               this.auth.signUp(this.uname, this.email, this.password).then(() =>
                  this.router.navigate([''])).catch(err => alert(err.message)
               );
            }
         });
      }
   }

}
