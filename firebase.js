import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB8ZOEfxhHcTXrSBxY6hXkogXc_Pwg3VG0",
    authDomain: "whatsapp-7f027.firebaseapp.com",
    projectId: "whatsapp-7f027",
    storageBucket: "whatsapp-7f027.appspot.com",
    messagingSenderId: "313459406413",
    appId: "1:313459406413:web:33a60f5d15f07c01ab8e04"
  };

  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

  const db = app.firestore();
  const auth = app.auth();
  const provider =  new firebase.auth.GoogleAuthProvider();

  export {db,auth,provider};