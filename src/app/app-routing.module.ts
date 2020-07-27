import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, LoginGuard, AdminGuard } from './guards/guards';
import { AccountComponent } from './components/account/account.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
   { path: '', component: HomeComponent, canActivate: [AuthGuard] },
   { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
   { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
   { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
