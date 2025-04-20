import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDIyybatMTtwbKXwF6kZUWH-pg9ckv3fF0",
  authDomain: "spd2-59068.firebaseapp.com",
  projectId: "spd2-59068",
  storageBucket: "spd2-59068.firebasestorage.app",
  messagingSenderId: "314387377235",
  appId: "1:314387377235:web:775a22ca423e3171f9aaa6"
};

  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app)

export { auth, firestore ,storage};
