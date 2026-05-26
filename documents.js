import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// CREATE
export async function createDocument(
  title,
  contact,
  emergencyContactName,
  emergencyContactNumber,
  emergencyContactRelation,
  bloodType,
  disability,
  notes,
  visibility
) {
  const user = auth.currentUser;

  return await addDoc(collection(db, "documents"), {
    uid: user.uid,

    title,
    contact,

    emergencyContactName,
    emergencyContactNumber,
    emergencyContactRelation,

    bloodType,
    disability,
    notes,

    visibility: visibility || "public",
    createdAt: Date.now()
  });
}

// READ
export async function getDocuments() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        resolve([]);
        return;
      }

      const q = query(
        collection(db, "documents"),
        where("uid", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      resolve(docs);
    });
  });
}