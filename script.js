import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔐 TU CONFIGURACIÓN
const firebaseConfig = {
  apiKey: "AIzaSyCdtOXIjjB_kL34DhJSGuaT5OWzw2i_A2E",
  authDomain: "cas-tracker-dcfc4.firebaseapp.com",
  projectId: "cas-tracker-dcfc4",
  storageBucket: "cas-tracker-dcfc4.appspot.com",
  messagingSenderId: "782100915031",
  appId: "1:782100915031:web:cd74ba7defa78927951412",
  measurementId: "G-67K0LVYY2H"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const GOAL = 10000;
const currentAmountEl = document.getElementById("currentAmount");
const progressFill = document.getElementById("progressFill");
const historyList = document.getElementById("historyList");
const form = document.getElementById("saveForm");

// Referencia a colección
const savingsRef = collection(db, "savings");

// 🔁 Escucha en tiempo real
onSnapshot(
  query(savingsRef, orderBy("createdAt", "asc")),
  snapshot => {
    let total = 0;
    historyList.innerHTML = "";

    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
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
    const percentage = Math.min((total / GOAL) * 100, 100);
    progressFill.style.width = `${percentage}%`;
  }
);

// ➕ Agregar ahorro
form.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const amount = Number(document.getElementById("amount").value);

  if (!name || amount <= 0) return;

  await addDoc(savingsRef, {
    name,
    amount,
    createdAt: Date.now()
  });

  form.reset();
});
