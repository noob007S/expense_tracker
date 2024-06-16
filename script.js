// script.js

const transactions = [];

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    if (description === '' || amount === '') {
        alert('Please fill in both fields');
        return;
    }

    const transaction = {
        id: generateID(),
        description,
        amount: +amount
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const list = document.getElementById('transaction-list');

    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    // Apply the color styling directly in the item creation
    item.style.color = transaction.amount < 0 ? 'red' : 'green';

    item.innerHTML = `
        ${transaction.description} <span>${transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

function removeTransaction(id) {
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
        transactions.splice(index, 1);
        updateLocalStorage();
        init();
    }
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    document.getElementById('balance').innerText = `₹${total}`;
    document.getElementById('money-plus').innerText = `₹${income}`;
    document.getElementById('money-minus').innerText = `₹${expense}`;
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

document.addEventListener('DOMContentLoaded', () => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions'));
    if (storedTransactions) {
        storedTransactions.forEach(transaction => transactions.push(transaction));
        init();
    }
});
