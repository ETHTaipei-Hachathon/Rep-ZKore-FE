import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCMC3EEqkda39Zwyi-6FMWXUvUc0-Q1Wz8',
  authDomain: 'rep-zkore.firebaseapp.com',
  projectId: 'rep-zkore',
  storageBucket: 'rep-zkore.appspot.com',
  messagingSenderId: '976929878108',
  appId: '1:976929878108:web:673c15759776a57e12b699',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
