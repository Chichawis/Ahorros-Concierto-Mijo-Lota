const GOAL = 10000;

const currentAmountEl = document.getElementById('currentAmount');
const progressFill = document.getElementById('progressFill');
const historyList = document.getElementById('historyList');
const form = document.getElementById('saveForm');

let savings = JSON.parse(localStorage.getItem('savings')) || [];

function updateUI() {
  const total = savings.reduce((sum, item) => sum + item.amount, 0);
  currentAmountEl.textContent = `$${total.toLocaleString()}`;

  const percentage = Math.min((total / GOAL) * 100, 100);
  progressFill.style.width = `${percentage}%`;

  historyList.innerHTML = '';

  savings
    .slice()
    .reverse()
    .forEach((item, index) => {
      const li = document.createElement('li');

      li.innerHTML = `
        <span>${item.name} — $${item.amount}</span>
        <button class="delete-btn">Eliminar</button>
      `;

      li.querySelector('.delete-btn').addEventListener('click', () => {
        savings.splice(savings.length - 1 - index, 1);
        localStorage.setItem('savings', JSON.stringify(savings));
        updateUI();
      });

      historyList.appendChild(li);
    });
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const amount = Number(document.getElementById('amount').value);

  if (!name || amount <= 0) return;

  savings.push({ name, amount });
  localStorage.setItem('savings', JSON.stringify(savings));

  form.reset();
  updateUI();
});

updateUI();

