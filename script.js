// Get elements from HTML
const nameInput = document.getElementById("purchase-name");
const costInput = document.getElementById("cost");
const dateInput = document.getElementById("purchase-date");
const paymentMethodInput = document.getElementById("payment-method");
const clearPurchasesBtn = document.getElementById("clear-purchases-btn");
const submitPurchaseBtn = document.getElementById("submit-purchase-btn");
const sortDropdown = document.getElementById("sort-dropdown");
const filterDropdown = document.getElementById("filter-dropdown");
const choosePaymentMethodInput = document.getElementById(
  "choose-payment-method"
);
const chooseCostInput = document.getElementById("choose-cost");
const purchaseDisplay = document.getElementById("purchase-display");
const totalCostDisplay = document.getElementById("total-cost");
const calculateTotalBtn = document.getElementById("calculate-total-btn");
const filterBtn = document.getElementById("filter-btn");

// Initialize purchase array
const purchaseArr = JSON.parse(localStorage.getItem("purchaseData")) || [];

// Ensure there are no special characters in input
const isValidInput = (str) => {
  const regex = /[^0-9a-zA-Z\s]/g;
  return !str.match(regex);
};

const isValidDate = (date) => {
  const today = new Date();
  return today.getTime() >= date.valueAsNumber;
};

const reformatDate = (str) => {
  const dateArr = str.split("-");
  const day = dateArr.pop();
  const month = dateArr.pop();
  const year = dateArr.pop();
  const newDate = [month, day, year];
  return newDate.join("-");
};

// Ensure fields are populated
const inputExists = (str) => {
  return str.length >= 1;
};

// Sorting methods
const sortByName = (arr) => {
  arr.sort((a, b) => {
    return a.name < b.name ? -1 : 1 || 0;
  });
};

const sortByCost = (arr, dir) => {
  arr.sort((a, b) => {
    if (dir === "low-high") {
      return Number(a.cost) < Number(b.cost) ? -1 : 1 || 0;
    } else {
      return Number(a.cost) > Number(b.cost) ? -1 : 1 || 0;
    }
  });
};

const sortByDate = (arr) => {
  arr.sort((a, b) => {
    return a.dateAsNumber < b.dateAsNumber ? -1 : 1 || 0;
  });
};

const sortByPaymentMethod = (arr) => {
  arr.sort((a, b) => {
    return a.paymentMethod < b.paymentMethod ? -1 : 1 || 0;
  });
};

const sortPurchases = () => {
  switch (sortDropdown.value) {
    case "name":
      sortByName(purchaseArr);
      break;
    case "low-high" || "high-low":
      sortByCost(purchaseArr, sortDropdown.value);
      break;
    case "most-recent":
      sortByDate(purchaseArr);
      break;
    case "payment":
      sortByPaymentMethod(purchaseArr);
      break;
  }
  updateDisplay();
};

const calculateTotalCost = () => {
  let total = 0;
  purchaseArr.forEach(({ cost }) => (total += Number(cost)));
  totalCostDisplay.innerHTML = `<strong>Total Spent: $${total.toFixed(
    2
  )}</strong>`;
};

const addPurchase = () => {
  if (!isValidInput(nameInput.value) || !inputExists(nameInput.value)) {
    alert("Please enter a valid item");
    return;
  } else if (!inputExists(costInput.value)) {
    alert("Please enter a cost");
    return;
  } else if (!inputExists(dateInput.value) || !isValidDate(dateInput)) {
    alert("Please enter a valid date");
    return;
  } else if (
    !isValidInput(paymentMethodInput.value) ||
    !inputExists(paymentMethodInput.value)
  ) {
    alert("Please enter a valid payment method");
    return;
  }
  const regex = /\s/g;
  const newId = `${nameInput.value.replace(regex, "-")}-${
    dateInput.valueAsNumber
  }`;
  const formattedDate = reformatDate(dateInput.value);
  const newPurchase = {
    id: dateInput.valueAsNumber,
    name: nameInput.value,
    cost: costInput.value,
    date: formattedDate,
    dateAsNumber: dateInput.valueAsNumber,
    paymentMethod: paymentMethodInput.value,
  };
  purchaseArr.push(newPurchase);
  localStorage.setItem("purchaseData", JSON.stringify(purchaseArr));
  updateDisplay();
};

const filterDisplay = (p) => {
  let dataToDisplay;
  switch (p) {
    case "all":
      dataToDisplay = [...purchaseArr];
      break;
    case "payment-method":
      dataToDisplay = purchaseArr.filter(
        ({ paymentMethod }) => paymentMethod === choosePaymentMethodInput.value
      );
      break;
    case "cost-max":
      dataToDisplay = purchaseArr.filter(
        ({ cost }) => Number(cost) <= Number(chooseCostInput.value)
      );
      break;
    case "cost-min":
      dataToDisplay = purchaseArr.filter(
        ({ cost }) => Number(cost) >= Number(chooseCostInput.value)
      );
      break;
  }
  return dataToDisplay;
};

const deletePurchase = (id) => {
  console.log(id);
  const purchaseToDelete = purchaseArr.findIndex((p) => p.id === id);
  console.log(purchaseToDelete);
  purchaseArr.splice(purchaseToDelete, 1);
  localStorage.setItem("purchaseData", JSON.stringify(purchaseArr));
  updateDisplay();
};

const updateDisplay = () => {
  nameInput.value = "";
  costInput.value = "";
  dateInput.value = "";
  paymentMethodInput.value = "";
  totalCostDisplay.innerHTML = "";
  purchaseDisplay.innerHTML = "";
  purchaseDisplay.innerHTML += filterDisplay(filterDropdown.value)
    .map((p) => {
      return `
              <div>
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
                <button type="button" onclick="deletePurchase(${
                  p.id
                })">Delete</button>
              </div>
          `;
    })
    .join("");
};

const clearPurchases = () => {
  chooseCostInput.value = "";
  choosePaymentMethodInput.value = "";
  purchaseArr.length = 0;
  localStorage.setItem("purchaseData", JSON.stringify(purchaseArr));
  updateDisplay();
};

if (purchaseArr.length) {
  updateDisplay();
}

// Button event listeners
sortDropdown.addEventListener("change", sortPurchases);

filterBtn.addEventListener("click", updateDisplay);

clearPurchasesBtn.addEventListener("click", clearPurchases);

calculateTotalBtn.addEventListener("click", calculateTotalCost);

submitPurchaseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addPurchase();
});

// TODO: add section to track money earned
// TODO: add functionality to calculate total money earned so far this month
