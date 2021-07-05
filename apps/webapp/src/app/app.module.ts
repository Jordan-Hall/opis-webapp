import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AngularFireModule } from '@angular/fire';
import { AuthGuard } from '@opishub/auth-firebase';
import { LayoutComponent, LayoutModule } from '@opis/template';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    LayoutModule,
    RouterModule.forRoot([
      {
        path: 'auth',
        loadChildren: () => import('@opishub/auth-ui').then(m => m.AuthUiModule),
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectLoggedInTo(['/']) }
      },
      {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['/auth']) },
        children: [
          {
            path: '',
            pathMatch: '',
            redirectTo: 'dashboard',
          },
          {
            path: 'dashboard',
            loadChildren: () => import('@opis/dashboard').then(m => m.DashboardModule)
          },
          {
            path: 'account',
            loadChildren: () => import('@opis/account').then(m => m.AccountModule)
          }
        ]
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
