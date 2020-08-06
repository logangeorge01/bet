import * as functions from 'firebase-functions';

//temp to give users $100

exports.createUser = functions.firestore.document('users/{userId}').onCreate((snap, context) =>
   snap.ref.update({balance: 100})
);




