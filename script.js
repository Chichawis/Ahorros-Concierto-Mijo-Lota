import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCdtOXIjjB_kL34DhJSGuaT5OWzw2i_A2E",
  authDomain: "cas-tracker-dcfc4.firebaseapp.com",
  projectId: "cas-tracker-dcfc4",
  storageBucket: "cas-tracker-dcfc4.appspot.com",
  messagingSenderId: "782100915031",
  appId: "1:782100915031:web:cd74ba7defa78927951412",
  measurementId: "G-67K0LVYY2H"
};

// 🚀 Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🎯 Config
const GOAL = 10000;

// 📌 DOM
const currentAmountEl = document.getElementById("currentAmount");
const progressFill = document.getElementById("progressFill");
const historyList = document.getElementById("historyList");
const form = document.getElementById("saveForm");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");

// 📂 Collection
const savingsRef = collection(db, "savings");

// 🔁 Real-time listener
const q = query(savingsRef, orderBy("createdAt"));

onSnapshot(q, snapshot => {
  let total = 0;
  historyList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (!data.name || !data.amount) return;

    total += data.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${data.name} — $${data.amount}</span>
      <button class="delete-btn">Eliminar</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", async () => {
      await deleteDoc(doc(db, "savings", docSnap.id));
    });

    historyList.prepend(li);
  });

  currentAmountEl.textContent = `$${total.toLocaleString()}`;
  progressFill.style.width = `${Math.min((total / GOAL) * 100, 100)}%`;
});

// ➕ Add saving
form.addEventListener("submit", async e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);

  if (!name || amount <= 0) return;

  await addDoc(savingsRef, {
    name,
    amount,
    createdAt: serverTimestamp()
  });

  form.reset();
});
