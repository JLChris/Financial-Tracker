// Get elements from HTML
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const clearTransactionsBtn = document.getElementById("clear-transactions-btn");
const submitTransactionBtn = document.getElementById("submit-transaction-btn");
const transactionListBody = document.getElementById("transaction-list-body");
const categoriesDropdown = document.getElementById("categories");
const incomeOrExpense = document.getElementById("income-expense");
const earningsDisplay = document.getElementById("earnings");
const expensesDisplay = document.getElementById("expenses");
const totalFinancesDisplay = document.getElementById("total-finances");

// Initialize purchase array
const transactionArr = JSON.parse(localStorage.getItem("purchaseData")) || [];

// Ensure fields are populated
const inputExists = (str) => {
  return str.length >= 1;
};

const calculateTotalFinances = () => {
  let total = 0;
  transactionArr.forEach(({ amount }) => (total += Number(amount)));
  totalFinancesDisplay.innerHTML = `<h2>${
    total > 0 ? "+" : "-"
  }$${total.toFixed(2)}</h2>`;
};

const calculateTotalEarnings = () => {
  let total = 0;
  transactionArr.forEach(({ amount }) => {
    if (amount > 0) {
      total += amount;
    }
  });
  earningsDisplay.innerHTML = `<h2>+$${total.toFixed(2)}</h2>`;
};

const calculateTotalExpenses = () => {
  let total = 0;
  transactionArr.forEach(({ amount }) => {
    if (amount < 0) {
      total += amount;
    }
  });
  expensesDisplay.innerHTML = `<h2>-$${Math.abs(total).toFixed(2)}</h2>`;
};

const populateCategoriesDropdown = () => {
  let content = "";
  if (incomeOrExpense.value === "expense") {
    content = `<option value="Food">Food</option>
            <option value="Activity">Activity</option>
            <option value="Bills">Bills</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Other">Other</option>`;
  } else {
    content = `<option value="Work">Work</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>`;
  }
  categoriesDropdown.innerHTML = content;
};

const addTransaction = () => {
  const date = new Date();
  const today = date.toLocaleDateString();
  const newId = Date.now();
  const amountNumber =
    incomeOrExpense.value === "income"
      ? Number(amountInput.value)
      : Number(amountInput.value) * -1;
  const newTransaction = {
    id: newId,
    category: categoriesDropdown.value,
    description: descriptionInput.value,
    amount: amountNumber,
    date: today,
  };
  transactionArr.push(newTransaction);
  localStorage.setItem("purchaseData", JSON.stringify(transactionArr));
  updateDisplay();
};

const updateDisplay = () => {
  descriptionInput.value = "";
  amountInput.value = "";
  transactionListBody.innerHTML = transactionArr
    .map((p) => {
      return `
              <tr>
                <td>${p.category}</td>
                <td>${p.description}</td>
                <td>${p.amount > 0 ? "+" : "-"}$${Math.abs(
        Number(p.amount)
      ).toFixed(2)}</td>
                <td>${p.date}</td>
              </tr>
          `;
    })
    .join("");
  calculateTotalEarnings();
  calculateTotalExpenses();
  calculateTotalFinances();
};

const clearTransactions = () => {
  transactionArr.length = 0;
  localStorage.setItem("purchaseData", JSON.stringify(transactionArr));
  updateDisplay();
};

if (transactionArr.length) {
  updateDisplay();
}

// Button event listeners

clearTransactionsBtn.addEventListener("click", clearTransactions);

incomeOrExpense.addEventListener("change", populateCategoriesDropdown);

populateCategoriesDropdown();
calculateTotalFinances();
calculateTotalEarnings();
calculateTotalExpenses();

submitTransactionBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTransaction();
});
