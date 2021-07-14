import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { map, startWith } from 'rxjs/operators';
import { FirebaseAuthService, User } from '@opishub/auth-firebase';

interface LayoutComponentState {
  mobileOpen: boolean;
  user: User
}

@Component({
  selector: 'opis-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          opacity: 1,
        })
      ),
      state(
        "closed",
        style({
          opacity: 0,
        }),

      ),
      transition("open => closed", [animate("300ms ease-in")]),
      transition("closed => open", [animate("300ms ease-out")])
    ]),
    trigger("openCloseMenu", [
      state(
        "open",
        style({
          transform: 'translateX(0px)',
        })
      ),
      state(
        "closed",
        style({
          transform: 'translateX(-100%)',
        })
      ),
      transition("open => closed", [animate("300ms ease-in-out")]),
      transition("closed => open", [animate("300ms ease-in-out")])
    ])
  ]
})
export class LayoutComponent {

  readonly openCloseTriggerBoolean$ = this.state.select('mobileOpen')

  readonly openCloseTrigger$ = this.state.select('mobileOpen').pipe(startWith(false),map(open => {
    return open ? 'open' : 'closed'
  }))

  readonly user$ = this.state.select('user');

  get mobileOpen(): boolean {
    return this.state.get('mobileOpen');
  }

  constructor(
    private state: RxState<LayoutComponentState>,
    protected authService: FirebaseAuthService,
    private router: Router
  ) {
    state.connect('user', authService.userData$);
  }

  toggleMobileMenu() {
    this.state.set({ mobileOpen: !this.mobileOpen})
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login'])
    });
  }
}
