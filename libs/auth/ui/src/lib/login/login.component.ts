import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
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

export class LoginComponent {
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

  @HostListener('click', ['$event'])
  submit() {
    if (this.form.valid) {
      this.login$.next({ email: this.email?.value as string, password: this.password?.value as string });
    }
  }
}
