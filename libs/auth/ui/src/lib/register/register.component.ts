import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseAuthService } from '@opishub/auth-firebase';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'opis-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RegisterComponent {
  readonly register$ = new Subject<{ email: string, password: string }>();
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
    route: ActivatedRoute,
  ) {
    const saveEffect$ = this.register$.pipe(
      switchMap((register) =>
        authService.register(register.email, register.password),
      ),
      tap(() => {
        router.navigate(['verify'], { relativeTo: route.parent })
      })
    );
    state.hold(saveEffect$);
  }

  submit() {
    if (this.form.valid) {
      this.register$.next({ email: this.email?.value as string, password: this.password?.value as string })
    }
  }
}
