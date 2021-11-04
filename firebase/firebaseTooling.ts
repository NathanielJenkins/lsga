import * as fb from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDkzA1RFBkMSbxuYSldNdQ4NdSNjL_BnDQ",
  authDomain: "lifespace-app.firebaseapp.com",
  projectId: "lifespace-app",
  storageBucket: "lifespace-app.appspot.com",
  messagingSenderId: "911589203008",
  appId: "1:911589203008:web:5f7b10d94c14754ffbd3a5",
  measurementId: "G-3W4YV9TV70",
};
if (!fb.default.apps.length) {
  fb.default.initializeApp(firebaseConfig);
} else {
  fb.default.app(); // if already initialized, use that one
}

const auth = fb.default.auth();
const firestore = fb.default.firestore();
export { auth, firestore };
