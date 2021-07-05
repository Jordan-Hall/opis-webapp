import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LetModule, } from '@rx-angular/template';

import { LoginComponent } from './login/login.component';
import { AuthContainerComponent } from './auth-container.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyComponent } from './verify/verify.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LetModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AuthContainerComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'login',
          },
          {
            path: 'login',
            component: LoginComponent
          },
          {
            path: 'register',
            component: RegisterComponent
          },
          {
            path: 'verify',
            component: VerifyComponent
          }
        ]
      },
    ])
  ],
  declarations: [
    AuthContainerComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
  ]
})
export class AuthUiModule {}
