// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    api: 'http://test.benjamin-ifland.de',
    firebase: {
        apiKey: 'AIzaSyBcIa6m8F7fT4gRLTx2zcBufUEE81gWVFg',
        authDomain: 'worshipgenerator.firebaseapp.com',
        databaseURL: 'https://worshipgenerator.firebaseio.com',
        projectId: 'worshipgenerator',
        storageBucket: 'worshipgenerator.appspot.com',
        messagingSenderId: '317378238562',
        appId: '1:317378238562:web:552ca27bc5e9086e'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
