import { auth, db } from "./firebase.js";
import { logout } from "./auth.js";
import {
  collection,
  addDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   NAVBAR AUTH + USERNAME
========================= */

auth.onAuthStateChanged(async (user) => {
  const signupLink = document.getElementById("signupLink");
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");
  const userGreeting = document.getElementById("userGreeting");

  if (!signupLink || !loginLink || !logoutLink || !userGreeting) return;

  if (user) {
    signupLink.style.display = "none";
    loginLink.style.display = "none";

    let username = "User";

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) username = snap.data().username;
    } catch (e) {
      console.log("username load failed", e);
    }

    userGreeting.style.display = "inline-block";
    userGreeting.innerText = `👋 Hey there, ${username}!`;

    logoutLink.style.display = "inline-block";
  } else {
    signupLink.style.display = "inline-block";
    loginLink.style.display = "inline-block";

    userGreeting.style.display = "none";
    logoutLink.style.display = "none";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logoutLink");

  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      await logout();
      window.location.href = "login.html";
    });
  }
});

