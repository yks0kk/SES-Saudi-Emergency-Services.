import { auth, db } from "./firebase.js";
import { logout } from "./auth.js";

import {
  collection,
  addDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   AUTH CHECK (optional safety)
========================= */
auth.onAuthStateChanged((user) => {
  if (!user) {
    console.log("Not logged in");
  }
});

/* =========================
   GET DOCUMENT TITLE
========================= */
async function getDocumentTitle(docId) {
  const ref = doc(db, "documents", docId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return "Document";

  return snap.data().title;
}

/* =========================
   CART
========================= */
let cart = [];

const addBtn = document.getElementById("addBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const totalEl = document.getElementById("total");
const cartIcon = document.getElementById("cartIcon");
const cartPanel = document.getElementById("cartPanel");
const checkoutBtn = document.getElementById("checkoutBtn");

const pricePerCard = 25;
const deliveryFee = 10;

/* =========================
   ADD TO CART
========================= */
if (addBtn) {
  addBtn.addEventListener("click", () => {
    const link = document.getElementById("docLink").value;

    if (!link) {
      alert("Paste document link first");
      return;
    }

    const docId = link.split("id=")[1];

    if (!docId) {
      alert("Invalid document link");
      return;
    }

    cart.push({
      id: Date.now(),
      docId
    });

    updateCartUI();
  });
}

/* =========================
   REMOVE ITEM
========================= */
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}
window.removeFromCart = removeFromCart;

/* =========================
   TOTAL
========================= */
function calculateTotal() {
  const subtotal = cart.length * pricePerCard;
  return subtotal + (cart.length > 0 ? deliveryFee : 0);
}

/* =========================
   UPDATE UI
========================= */
async function updateCartUI() {
  if (cartCountEl) cartCountEl.innerText = cart.length;

  if (cartItemsEl) {
    let html = "";

    for (let item of cart) {
      const title = await getDocumentTitle(item.docId);

      html += `
        <div class="cart-item">

          <span style="flex:2;">
            📄 ${title}
          </span>

          <span style="flex:1; text-align:center;">
            ${pricePerCard} SAR
          </span>

          <span onclick="removeFromCart(${item.id})"
                style="cursor:pointer;">
            🗑️
          </span>

        </div>
      `;
    }

    cartItemsEl.innerHTML = html;
  }

  if (totalEl) {
    totalEl.innerText = calculateTotal();
  }
}

/* =========================
   CART OPEN / CLOSE
========================= */
if (cartIcon && cartPanel) {
  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    cartPanel.classList.toggle("open");
  });
}

document.addEventListener("click", (e) => {
  if (!cartPanel || !cartIcon) return;

  if (
    !cartPanel.contains(e.target) &&
    !cartIcon.contains(e.target)
  ) {
    cartPanel.classList.remove("open");
  }
});

/* =========================
   CHECKOUT + RECEIPT + EMAIL
========================= */
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in");
      window.location.href = "login.html";
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    let receipt = "ORDER RECEIPT\n\n";
    let total = 0;

    for (let item of cart) {
      const title = await getDocumentTitle(item.docId);
      receipt += `${title} - ${pricePerCard} SAR\n`;
      total += pricePerCard;
    }

    const delivery = cart.length > 0 ? deliveryFee : 0;
    total += delivery;

    receipt += `\nDelivery: ${delivery} SAR`;
    receipt += `\nTOTAL: ${total} SAR`;

    // =========================
    // SEND EMAIL (EMAILJS)
    // =========================
    try {
      await emailjs.send(
        "service_h9r9zdg",
        "template_g8gsmim",
        {
          to_email: user.email,
          message: receipt
        }
      );

      alert("Order placed! Receipt sent to your email.");
    } catch (err) {
      console.error("Email failed:", err);
      alert("Order placed, but email failed to send.");
    }

    // =========================
    // SAVE ORDER IN FIRESTORE
    // =========================
    await addDoc(collection(db, "orders"), {
      uid: user.uid,
      items: cart,
      total,
      createdAt: Date.now()
    });

    cart = [];
    updateCartUI();
  });
}