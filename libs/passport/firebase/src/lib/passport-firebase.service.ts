import { Injectable, Inject } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { serviceAccountToken, databaseUrlToken } from './token';


@Injectable()
export class FirebaseService {
  readonly firebaseApp: firebase.app.App;
  constructor(
    @Inject(serviceAccountToken) serviceAccount: string | firebase.ServiceAccount,
    @Inject(databaseUrlToken) databaseUrlToken: string,
  ) {

    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: databaseUrlToken
    });
  }
}
