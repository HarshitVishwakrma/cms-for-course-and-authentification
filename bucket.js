// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./cmsforproject-firebase-adminsdk-zp07d-ccbbc7a359.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://cmsforproject.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = bucket;
