import {
  addOrderCards,
  ordersSortConfig,
  setOrdersSortConfig,
  toggleSortButton,
} from "../utils";
import { getOrders } from "../api/fetchOrders";

export function createOrdersSortButtons() {
  const dateButton = document.createElement("button");
  dateButton.className = "sort-button";
  dateButton.innerHTML = "Date";
  dateButton.dataset.type = "Date";

  const priceButton = document.createElement("button");
  priceButton.className = "sort-button";
  priceButton.innerHTML = "Price";
  priceButton.dataset.type = "Price";

  dateButton.addEventListener("click", function () {
    toggleHandler(dateButton);
  });

  priceButton.addEventListener("click", function () {
    toggleHandler(priceButton);
  });

  const ordersSortContainer = document.querySelector(".orders-sort");
  ordersSortContainer.append(dateButton, priceButton);
}

function toggleHandler(clickedButton) {
  const buttonType = clickedButton.dataset.type.toLowerCase();
  let previousButton;

  if (clickedButton.dataset.type === "Date") {
    previousButton = document.querySelector('button[data-type="Price"]');
  } else {
    previousButton = document.querySelector('button[data-type="Date"]');
  }

  if (ordersSortConfig.criterion !== buttonType) {
    toggleSortButton(previousButton, "none");
  }

  if (
    ordersSortConfig.criterion === buttonType &&
    ordersSortConfig.direction === "ascending"
  ) {
    setOrdersSortConfig("none", "none");
    toggleSortButton(clickedButton, "none");
  } else if (
    ordersSortConfig.criterion === buttonType &&
    ordersSortConfig.direction === "descending"
  ) {
    setOrdersSortConfig(buttonType, "ascending");
    toggleSortButton(clickedButton, "ascending");
  } else {
    setOrdersSortConfig(buttonType, "descending");
    toggleSortButton(clickedButton, "descending");
  }

  getOrders().then((data) => {
    addOrderCards(data);
  });
}
