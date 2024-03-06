import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDX-2PiX7_E4FPoiS90tjZ3T80oOmlzv4Q",
  authDomain: "incentiveapp-b9eae.firebaseapp.com",
  projectId: "incentiveapp-b9eae",
  storageBucket: "incentiveapp-b9eae.appspot.com",
  messagingSenderId: "616203874490",
  appId: "1:616203874490:web:b0cfa1777208a582921283",
  measurementId: "G-HTD8P53CP6"
};

const app = initializeApp(firebaseConfig);
const auth =  getAuth(app);
export {auth};
