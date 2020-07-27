import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard, LoginGuard, AdminGuard } from './guards/guards';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/account/account.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      LoginComponent,
      AccountComponent,
      AdminComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule
   ],
   providers: [
      AuthGuard,
      LoginGuard,
      AdminGuard
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
