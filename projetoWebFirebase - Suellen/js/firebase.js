  // Your web app's Firebase configuration

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {

    apiKey: "AIzaSyBVvusCAEV_PNqx5OpILYJ6PP5y0NdF_JM",
    authDomain: "command-language-school.firebaseapp.com",
    databaseURL: "https://command-language-school-default-rtdb.firebaseio.com",
    projectId: "command-language-school",
    storageBucket: "command-language-school.appspot.com",
    messagingSenderId: "36578510101",
    appId: "1:36578510101:web:efe7eaec60b41f2079d51c",
    measurementId: "G-DYGJ98RFMD"

  };


/*
* Nas regras do Realtime Database, informe:
* {
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
*/

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
