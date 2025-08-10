import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import{ getAuth} from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCJU6Qo_cMKd1OEq_RwOpXQji-uG0IsGhU",
  authDomain: "nascollectionecommerce.firebaseapp.com",
  projectId: "nascollectionecommerce",
  storageBucket: "nascollectionecommerce.firebasestorage.app",
  messagingSenderId: "639065431613",
  appId: "1:639065431613:web:77703768ccd86f7d05d454"
};

const Firebase_app = initializeApp(firebaseConfig);
export const Firebase_db = getFirestore(Firebase_app);
export const Firebase_auth = getAuth(Firebase_app);
export const Firebase_storage = getStorage(Firebase_app,'gs://nascollectionecommerce.firebasestorage.app'); // Added bucket URL