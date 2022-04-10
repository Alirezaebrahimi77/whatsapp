import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyADva_TJGuAgUCru6ZhNa-oVOPOECRgDdU",
    authDomain: "whatsapp2-13ed9.firebaseapp.com",
    projectId: "whatsapp2-13ed9",
    storageBucket: "whatsapp2-13ed9.appspot.com",
    messagingSenderId: "357263260822",
    appId: "1:357263260822:web:08eb45143154066de916b7"
  };

initializeApp(firebaseConfig);



const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export {db, auth, provider};