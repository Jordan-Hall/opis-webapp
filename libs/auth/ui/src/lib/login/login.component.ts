import { Component, ChangeDetectionStrategy, HostListener, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '@opishub/auth-firebase';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'opis-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LoginComponent implements AfterContentInit {
  readonly login$ = new Subject<{ email: string, password: string }>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
  });

  protected get email() {
    return this.form.get('email');
  }
  protected get password() {
    return this.form.get('password');
  }

  constructor(
    authService: FirebaseAuthService,
    state: RxState<never>,
    router: Router,
  ) {
    const saveEffect$ = this.login$.pipe(
      switchMap((account) =>
        authService.login(account.email, account.password),
      ),
      tap(() => router.navigate(['/']))
    );
    state.hold(saveEffect$);
  }

  ngAfterContentInit() {
    const storageItems = localStorage.getItem('autologin');
    if (storageItems) {
      const webappAutoLogin = JSON.parse(storageItems)
      this.login$.next({ email: webappAutoLogin.username as string, password: webappAutoLogin.password as string });
    }
  }

  @HostListener('click', ['$event'])
  submit() {
    if (this.form.valid) {
      this.login$.next({ email: this.email?.value as string, password: this.password?.value as string });
    }
  }
}
