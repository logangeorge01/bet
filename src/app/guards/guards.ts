import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService} from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private auth: AuthService,
      private router: Router
   ) {}

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.auth.user$.pipe(
         map(usr => {
            if (!usr) {
               this.router.navigate(['login']);
               return false;
            }
            return true;
         })
      );
   }
}
