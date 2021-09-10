import { Injectable, Inject } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import firebase from "firebase"
import { serviceAccountToken, databaseUrlToken } from './token';

const firebaseConfig = {
  apiKey: "AIzaSyDZrAkyGbk_PcuMP34j8CpkoFsIc7FeHKY",
  authDomain: "fir-opis-coin.firebaseapp.com",
  databaseURL: "https://fir-opis-coin-default-rtdb.firebaseio.com",
  projectId: "fir-opis-coin",
  storageBucket: "fir-opis-coin.appspot.com",
  messagingSenderId: "456212415877",
  appId: "1:456212415877:web:cabbfc41b15f5c9d44b0ec"
};

@Injectable()
export class FirebaseService {
  readonly firebaseApp: firebaseAdmin.app.App;
  readonly firebaseClient:  firebase.app.App;
  constructor(
    @Inject(serviceAccountToken) serviceAccount: string | firebaseAdmin.ServiceAccount,
    @Inject(databaseUrlToken) databaseUrlToken: string,
  ) {
    this.firebaseApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: databaseUrlToken
    });

    this.firebaseClient = firebase.initializeApp(firebaseConfig);
  }
}
