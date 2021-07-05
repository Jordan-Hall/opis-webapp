import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { AuthPipeGenerator, loggedIn } from '@angular/fire/auth-guard';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(protected router: Router, protected auth: AngularFireAuth) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authPipeFactory = next.data.authGuardPipe as AuthPipeGenerator || (() => loggedIn);
    return this.auth.user.pipe(
      take(1),
      authPipeFactory(next, state),
      map(can => {
        if (typeof can === 'boolean') {
          return can;
        } else if (Array.isArray(can)) {
          return this.router.createUrlTree(can);
        } else {
          return this.router.parseUrl(can);
        }
      })
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authPipeFactory = next.data.authGuardPipe as AuthPipeGenerator || (() => loggedIn);
    return this.auth.user.pipe(
      take(1),
      authPipeFactory(next, state),
      map(can => {
        if (typeof can === 'boolean') {
          return can;
        } else if (Array.isArray(can)) {
          return this.router.createUrlTree(can);
        } else {
          return this.router.parseUrl(can);
        }
      })
    );
  }
}
