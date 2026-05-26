import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const id = new URLSearchParams(window.location.search).get("id");

// DOM elements
const title = document.getElementById("title");
const contact = document.getElementById("contact");

const emergencyName = document.getElementById("emergencyName");
const emergencyNumber = document.getElementById("emergencyNumber");
const emergencyRelation = document.getElementById("emergencyRelation");

const bloodType = document.getElementById("bloodType");
const disability = document.getElementById("disability");
const notes = document.getElementById("notes");

// NEW: footer element (make sure you add this div in HTML)
const footer = document.getElementById("footer");

async function load() {
  const ref = doc(db, "documents", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    document.body.innerHTML = "Not found";
    return;
  }

  const data = snap.data();

  title.innerText = data.title || "";

  contact.innerText = "📞 " + (data.contact || "");

  emergencyName.innerText =
    "Emergency Contact: " + (data.emergencyContactName || "");

  emergencyNumber.innerText =
    "📞 " + (data.emergencyContactNumber || "");

  emergencyRelation.innerText =
    "Relation: " + (data.emergencyContactRelation || "");

  bloodType.innerText = "🩸 " + (data.bloodType || "");

  disability.innerText = "⚠️ " + (data.disability || "");

  notes.innerText = data.notes || "";

  // ✅ FOOTER (only appears when viewing link/NFC)
  if (footer) {
    footer.innerHTML = `
      <br><hr>
      <div style="font-size:14px; color:aliceblue;">
        — Created with <b>SES</b> • 
        <a href="https://yourwebsite.com" target="_blank" style="color:aliceblue; text-decoration:none;">
          Checkout our website
        </a>
      </div>
    `;
  }
}

load();