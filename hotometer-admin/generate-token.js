const admin = require("firebase-admin");
const SHA256 = require('crypto-js/sha256');
const _ = require('lodash');

const argumentOrder = ['email', 'secret'];

const arguments = _.zipObject(argumentOrder, _.drop(process.argv, 2));

const token = SHA256(`${arguments.email}-${arguments.secret}`).toString();

var serviceAccount = require(`${__dirname}/config/admin.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quentin-b880c.firebaseio.com"
});

admin.auth().createCustomToken(token).then(function(customToken) {
    console.log(`SUCCESS!\nToken: ${customToken}`);
  })
  .catch(function(error) {
    console.log("Error creating custom token:", error);
  });