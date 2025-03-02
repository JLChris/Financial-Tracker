// Get elements from HTML
const nameInput = document.getElementById("purchase-name");
const costInput = document.getElementById("cost");
const dateInput = document.getElementById("purchase-date");
const paymentMethodInput = document.getElementById("payment-method");
const clearBtn = document.getElementById("clear-btn");
const submitBtn = document.getElementById("submit-btn");
const sortDropdown = document.getElementById("sort-dropdown");
const totalDisplay = document.getElementById("display-total");
const totalCostDisplay = document.getElementById("total-cost");
const calculateTotalBtn = document.getElementById("calculate-total-btn");

// Initialize purchase array. TODO: instead retrieve saved array from localStorage
let purchaseArr = [];

// Ensure there are no special characters in input
const isValidInput = (str) => {
  const regex = /[^0-9a-zA-Z\s]/g;
  return !str.match(regex);
};

// Ensure fields are populated
const inputExists = (str) => {
  return str.length >= 1;
};

// Sorting methods. TODO: refactor and simplify methods for readability
const sortByName = (arr) => {
  arr.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });
};

const sortByCost = (arr, dir) => {
  arr.sort((a, b) => {
    if (Number(a.cost) < Number(b.cost)) {
      return dir === "low-high" ? -1 : 1;
    } else if (Number(a.cost) > Number(b.cost)) {
      return dir === "low-high" ? 1 : -1;
    } else {
      return 0;
    }
  });
};

const sortByDate = (arr) => {
  arr.sort((a, b) => {
    if (a.dateAsNumber < b.dateAsNumber) {
      return 1;
    } else if (a.dateAsNumber > b.dateAsNumber) {
      return -1;
    } else {
      return 0;
    }
  });
};

const sortByPaymentMethod = (arr) => {
  arr.sort((a, b) => {
    if (a.paymentMethod < b.paymentMethod) {
      return -1;
    } else if (a.paymentMethod > b.paymentMethod) {
      return 1;
    } else {
      return 0;
    }
  });
};

const sortPurchases = () => {
  if (sortDropdown.value === "name") {
    sortByName(purchaseArr);
  } else if (
    sortDropdown.value === "low-high" ||
    sortDropdown.value === "high-low"
  ) {
    sortByCost(purchaseArr, sortDropdown.value);
  } else if (sortDropdown.value === "most-recent") {
    sortByDate(purchaseArr);
  } else if (sortDropdown.value === "payment") {
    sortByPaymentMethod(purchaseArr);
  }
  updateDisplay();
};

const calculateTotalCost = () => {
  let total = 0;
  purchaseArr.forEach(({ cost }) => (total += Number(cost)));
  totalCostDisplay.innerHTML = `<strong>Total Spent: $${total}</strong>`;
};

const addPurchase = () => {
  if (!isValidInput(nameInput.value) || !inputExists(nameInput.value)) {
    alert("Please enter a valid item");
    return;
  } else if (!inputExists(costInput.value)) {
    alert("Please enter a cost");
    return;
  } else if (!inputExists(dateInput.value)) {
    alert("Please enter a date");
    return;
  } else if (
    !isValidInput(paymentMethodInput.value) ||
    !inputExists(paymentMethodInput.value)
  ) {
    alert("Please enter a valid payment method");
    return;
  }
  const newPurchase = {
    name: nameInput.value,
    cost: costInput.value,
    date: dateInput.value,
    dateAsNumber: dateInput.valueAsNumber,
    paymentMethod: paymentMethodInput.value,
  };
  purchaseArr.push(newPurchase);
  console.log(newPurchase);
  updateDisplay();
};

const updateDisplay = () => {
  nameInput.value = "";
  costInput.value = "";
  dateInput.value = "";
  paymentMethodInput.value = "";
  sortDropdown.value = "";
  totalCostDisplay.innerHTML = "";
  totalDisplay.innerHTML = "";
  totalDisplay.innerHTML += purchaseArr
    .map((p) => {
      return `
              <ul>
                  <li>Purchase: ${p.name}</li>
                  <li>Cost: $${
                    p.cost.length === 1
                      ? p.cost + ".00"
                      : p.cost.length === 3
                      ? p.cost + "0"
                      : p.cost
                  }</li>
                  <li>Date: ${p.date}</li>
                  <li>Payment Method: ${p.paymentMethod}</li>
              </ul>
          `;
    })
    .join("");
};

const clearPurchases = () => {
  purchaseArr = [];
  updateDisplay();
};

// Button event listeners
sortDropdown.addEventListener("change", sortPurchases);

clearBtn.addEventListener("click", clearPurchases);

calculateTotalBtn.addEventListener("click", calculateTotalCost);

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addPurchase();
});

// TODO: add functionality to filter list by cost, date, or payment method
// TODO: add section to track money earned
// TODO: add form validation to ensure user can't input a future date
// TODO: add functionality to calculate total money earned so far this month
