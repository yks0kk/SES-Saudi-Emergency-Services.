import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logout } from "./auth.js";
import { createDocument, getDocuments } from "./documents.js";

// AUTH CHECK
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // GET USERNAME
  const snap = await getDoc(doc(db, "users", user.uid));

  let username = "User";

  if (snap.exists()) {
    username = snap.data().username;
  }

  // SHOW WELCOME TEXT
  document.getElementById("welcome").innerText = `Welcome ${username}`;

  loadDocs();
});

// SAVE DOCUMENT
document.getElementById("saveBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const contact = document.getElementById("contact").value;

  const emergencyContactName = document.getElementById("emergencyContactName").value;
  const emergencyContactNumber = document.getElementById("emergencyContactNumber").value;
  const emergencyContactRelation = document.getElementById("emergencyContactRelation").value;

  const bloodType = document.getElementById("bloodType").value;
  const disability = document.getElementById("disability").value;
  const notes = document.getElementById("notes").value;
  const visibility = document.getElementById("visibility").value;

  if (!title || !contact || !emergencyContactName || !emergencyContactNumber || !emergencyContactRelation || !bloodType) {
    alert("Please fill required fields");
    return;
  }

  await createDocument(
    title,
    contact,
    emergencyContactName,
    emergencyContactNumber,
    emergencyContactRelation,
    bloodType,
    disability,
    notes,
    visibility
  );

  alert("Saved!");
  loadDocs();
});

// LOAD DOCUMENTS
async function loadDocs() {
  const docs = await getDocuments();

  const container = document.getElementById("docs");

  container.innerHTML = docs.map(d => `
  <div style="border:1px solid #ccc; padding:10px; margin:5px;">
    <h3>${d.title}</h3>
    <p>📞 ${d.contact}</p>
    <p>🩸 ${d.bloodType}</p>
    <p>🆘 ${d.emergencyContactName} (${d.emergencyContactRelation})</p>
<p>☎️ ${d.emergencyContactNumber}</p>
    <p>⚠️ ${d.disability}</p>

    <a href="editor.html?id=${d.id}">Edit</a> |
    <a href="view.html?id=${d.id}">View</a>   |
    <button onclick="copyLink('${d.id}')">Copy Link</button>
  </div>
`).join("");
}

window.copyLink = (id) => {
  const link = `${window.location.origin}/view.html?id=${id}`;

  navigator.clipboard.writeText(link)
    .then(() => {
      alert("Link copied!");
    })
    .catch(() => {
      alert("Failed to copy link");
    });
};

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await logout();
  window.location.href = "login.html";
});