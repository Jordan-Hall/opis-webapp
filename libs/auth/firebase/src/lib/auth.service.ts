import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { from, Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, tap, map, catchError, withLatestFrom } from 'rxjs/operators';
import firebase from 'firebase';
import { User } from './interfaces/user';
import { BoincService } from '@opishub/boinc';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private authUserData = this.fireAuth.authState as Observable<User | null>;

  private boincAuthToken = new BehaviorSubject<Record<string, unknown>>(JSON.parse(localStorage.getItem('authToken2') || '{}'));

  userData$ = combineLatest([this.authUserData, this.boincAuthToken]).pipe(
    map(([user, boincUser]) => {
      return {...user, boincUser: boincUser}
    })
  )

  constructor(
    protected fireStore: AngularFirestore,
    protected fireAuth: AngularFireAuth,
    protected ngZone: NgZone,
    private boincService: BoincService,
    private httpClient: HttpClient
  ) {}

  login(username: string, password: string) {
    return from(
      this.fireAuth.signInWithEmailAndPassword(username, password)
    ).pipe(
      withLatestFrom(this.boincService.login(username, password)),
      map(([result, auth]) => this.setUserData(result.user as firebase.User, auth))
    )
  }

  register(username: string, password: string) {
    return this.httpClient.post('/api', {
      email: username,
      password,
      displayName: username
    }).pipe(
      switchMap(() => from(this.fireAuth.signInWithEmailAndPassword(username, password))),
      switchMap((result) => {
        return this.boincService.login(username, password).pipe(
          map(auth => [result, auth])
        )
      }),
      switchMap(([result, auth]) => {
        return this.setUserData((result as firebase.auth.UserCredential).user as firebase.User, auth)
      }),
      switchMap(() => {
        return this.sendVerificationMail()
      }),
    )
  }

  logout() {
    return from(this.fireAuth.signOut()).pipe(tap(() => localStorage.removeItem('user')));
  }

  sendVerificationMail() {
    return from(this.fireAuth.currentUser).pipe(tap((user) => user?.sendEmailVerification()))
  }

  forgotPassword(passwordResetEmail: string) {
    return from(this.fireAuth.sendPasswordResetEmail(passwordResetEmail))
  }

  private setUserData(user: firebase.User, authToken?: Record<string, unknown>, credit?: string) {
    if (authToken) {
      localStorage.setItem('authToken2', JSON.stringify(authToken));
      this.boincAuthToken.next(authToken);
    }
    const userRef: AngularFirestoreDocument<User> = this.fireStore.doc(`users/${user.uid}`);
    const updateUser = {
      uid: user.uid,
      email: user.email as string,
      displayName: user.displayName as string,
      photoURL: user.photoURL as string,
      emailVerified: user.emailVerified,
      boincUser: authToken ? authToken : { id: '0' },
      credit: credit || '0'
    }
    return from(userRef.set(updateUser, {
      merge: true
    })).pipe(map(() => {
      return updateUser
    }), catchError(error => {
      return from(error);
    }))
  }

}
