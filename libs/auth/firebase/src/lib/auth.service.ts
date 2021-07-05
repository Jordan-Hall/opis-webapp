import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import firebase from 'firebase';
import { User } from './interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  userData?: firebase.User;
  constructor(
    protected fireStore: AngularFirestore,
    protected fireAuth: AngularFireAuth,
    protected ngZone: NgZone
  ) {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  login(username: string, password: string) {
    return from(
      this.fireAuth.signInWithEmailAndPassword(username, password)
    ).pipe(
      switchMap(result => this.setUserData(result.user as firebase.User))
    )
  }

  register(username: string, password: string) {
    return from(
      this.fireAuth.createUserWithEmailAndPassword(username, password)
    ).pipe(
      switchMap(() => this.sendVerificationMail()),
      switchMap((result) => this.setUserData(result as firebase.User))
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

  private setUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<User> = this.fireStore.doc(`users/${user.uid}`);
    return from(userRef.set({
      uid: user.uid,
      email: user.email as string,
      displayName: user.displayName as string,
      photoURL: user.photoURL as string,
      emailVerified: user.emailVerified
    }, {
      merge: true
    })).pipe(map(() => user), catchError(error => {
      return from(error);
    }))
  }

}
