import {
  addEventCards,
  eventsSortConfig,
  setEventsSortConfig,
  toggleSortButton,
} from "../utils";
import { getEvents } from "../api/fetchEvents";

export function createEventsSortButtons() {
  const dateButton = document.createElement("button");
  dateButton.className = "sort-button";
  dateButton.innerHTML = "Date";
  dateButton.dataset.type = "Date";

  const nameButton = document.createElement("button");
  nameButton.className = "sort-button";
  nameButton.innerHTML = "Name";
  nameButton.dataset.type = "Name";

  dateButton.addEventListener("click", function () {
    toggleHandler(dateButton);
  });

  nameButton.addEventListener("click", function () {
    toggleHandler(nameButton);
  });

  const ordersSortContainer = document.querySelector(".events-sort");
  ordersSortContainer.append(dateButton, nameButton);
}

function toggleHandler(clickedButton) {
  const buttonType = clickedButton.dataset.type.toLowerCase();
  let previousButton;
  if (clickedButton.dataset.type === "Date") {
    previousButton = document.querySelector('button[data-type="Name"]');
  } else {
    previousButton = document.querySelector('button[data-type="Date"]');
  }
  if (eventsSortConfig.criterion !== buttonType) {
    toggleSortButton(previousButton, "none");
  }
  if (
    eventsSortConfig.criterion === buttonType &&
    eventsSortConfig.direction === "ascending"
  ) {
    setEventsSortConfig("none", "none");
    toggleSortButton(clickedButton, "none");
  } else if (
    eventsSortConfig.criterion === buttonType &&
    eventsSortConfig.direction === "descending"
  ) {
    setEventsSortConfig(buttonType, "ascending");
    toggleSortButton(clickedButton, "ascending");
  } else {
    setEventsSortConfig(buttonType, "descending");
    toggleSortButton(clickedButton, "descending");
  }
  getEvents().then((data) => {
    addEventCards(data);
  });
}
