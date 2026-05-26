import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

// inputs
const title = document.getElementById("editor-title");
const contact = document.getElementById("editor-contact");

const emergencyContactName = document.getElementById("editor-emergencyContactName");
const emergencyContactNumber = document.getElementById("editor-emergencyContactNumber");
const emergencyContactRelation = document.getElementById("editor-emergencyContactRelation");

const bloodType = document.getElementById("editor-bloodType");
const disability = document.getElementById("editor-disability");
const notes = document.getElementById("editor-notes");

const visibility = document.getElementById("editor-visibility");

// LOAD
async function loadDoc() {
  const ref = doc(db, "documents", docId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    document.body.innerHTML = "Document not found";
    return;
  }

  const data = snap.data();

  title.value = data.title || "";
  contact.value = data.contact || "";

  emergencyContactName.value = data.emergencyContactName || "";
  emergencyContactNumber.value = data.emergencyContactNumber || "";
  emergencyContactRelation.value = data.emergencyContactRelation || "";

  bloodType.value = data.bloodType || "";
  disability.value = data.disability || "";
  notes.value = data.notes || "";

  visibility.value = data.visibility || "public";
}

loadDoc();

// SAVE
document.getElementById("editor-saveBtn").addEventListener("click", async () => {
  try {
    console.log("SAVE CLICKED");

    const get = (id) => document.getElementById(id)?.value || "";

    const ref = doc(db, "documents", docId);

    await updateDoc(ref, {
      title: get("editor-title"),
      contact: get("editor-contact"),
      emergencyContactName: get("editor-emergencyContactName"),
      emergencyContactNumber: get("editor-emergencyContactNumber"),
      emergencyContactRelation: get("editor-emergencyContactRelation"),
      bloodType: get("editor-bloodType"),
      disability: get("editor-disability"),
      notes: get("editor-notes")
    });

    alert("Updated successfully!");
  } catch (err) {
    console.error("SAVE ERROR:", err);
    alert("Save failed — check console");
  }
});