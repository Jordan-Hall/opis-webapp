// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  boincUrl: "http://localhost:4200/boinc",
  creditMaths: 0.001,
  firebase: {
    apiKey: "AIzaSyDZrAkyGbk_PcuMP34j8CpkoFsIc7FeHKY",
    authDomain: "fir-opis-coin.firebaseapp.com",
    databaseURL: "https://fir-opis-coin-default-rtdb.firebaseio.com",
    projectId: "fir-opis-coin",
    storageBucket: "fir-opis-coin.appspot.com",
    messagingSenderId: "456212415877",
    appId: "1:456212415877:web:7a919ec67188835744b0ec"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
