import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';

interface AuthContainerState {
  isLoginPage: boolean
}
@Component({
  selector: 'opis-auth-container',
  templateUrl: 'auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
  providers: [RxState],
})
export class AuthContainerComponent {

  isLogin$ = this.state.select('isLoginPage')

  constructor(
    router: Router,
    private state: RxState<AuthContainerState>
  ) {

    state.connect('isLoginPage',
      router.events
        .pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filter((e: any) => e instanceof NavigationEnd),
          map((event: NavigationEnd) => {
            return event.url.includes('login') || event.url === '/auth';
          })
        )
    );
  }

}
