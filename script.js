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
.forEach(item => {
const li = document.createElement('li');
li.innerHTML = `<span>${item.name}</span><strong>$${item.amount}</strong>`;
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
