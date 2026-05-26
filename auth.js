import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// REGISTER (UPDATED)
export async function register(username, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    username: username
  });

  return userCredential;
}


// LOGIN
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

//password rest
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    if (!email) {
      alert("Please enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      alert("Password reset email sent! (check spam if u can't find");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
}


// LOGOUT
export async function logout() {
  return await signOut(auth);
}