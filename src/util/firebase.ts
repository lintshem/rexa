import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyC5-4_xynM-k0crC57J6hDzoD94qNgXLys",

    authDomain: "tso-store-48dcb.firebaseapp.com",

    databaseURL: "https://tso-store-48dcb-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "tso-store-48dcb",

    storageBucket: "tso-store-48dcb.appspot.com",

    messagingSenderId: "1010273865425",

    appId: "1:1010273865425:web:890a27307c71b1b2107ff0"

};



// Initialize Firebase

export const app=initializeApp(firebaseConfig);

