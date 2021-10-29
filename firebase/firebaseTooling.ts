import * as fb from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAoUYB4BjsPOFwVs7pG8oHnZfeYU48itDk",
  authDomain: "lifespace-6a560.firebaseapp.com",
  databaseURL: "https://lifespace-6a560.firebaseio.com",
  projectId: "lifespace-6a560",
  storageBucket: "lifespace-6a560.appspot.com",
  messagingSenderId: "sender-id",
  appId: "1:446627723287:web:65c3ef295ac44498d64452",
  measurementId: "G-measurement-id"
};
if (!fb.default.apps.length) {
  fb.default.initializeApp(firebaseConfig);
} else {
  fb.default.app(); // if already initialized, use that one
}

const auth = fb.default.auth();
export { auth };

