import { formatDate, updatePrice, toggleCartButton } from "../utils";
import { createDropdown } from "./createTCDropdown";
import { createIncrementer } from "./createIncrementer";
import { API_BASE_URL } from "../config";

function attachEvents(cardElement) {
  const decrementButton = cardElement.querySelector("#decrementButton");
  const incrementButton = cardElement.querySelector("#incrementButton");
  const cartButton = cardElement.querySelector(".add-button");
  const input = cardElement.querySelector(".quantity-input");
  const dropdown = cardElement.querySelector(".ticket-category-dropdown");
  const priceElement = cardElement.querySelector("#totalPrice");

  decrementButton.addEventListener("click", function () {
    if (input.value > input.min) {
      input.value = parseInt(input.value, 10) - 1;
    }
    toggleCartButton(input, cartButton);
    updatePrice(input, dropdown, priceElement);
  });

  incrementButton.addEventListener("click", function () {
    if (input.value < input.max) {
      input.value = parseInt(input.value, 10) + 1;
    }
    toggleCartButton(input, cartButton);
    updatePrice(input, dropdown, priceElement);
  });

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.value = 0;
    }
    toggleCartButton(input, cartButton);
    updatePrice(input, dropdown, priceElement);
  });

  input.addEventListener("input", function () {
    toggleCartButton(input, cartButton);
    updatePrice(input, dropdown, priceElement);
  });

  cartButton.addEventListener("click", function () {
    handleAddToCart(dropdown, input, cartButton, priceElement);
  });

  if (dropdown) {
    dropdown.addEventListener("change", function () {
      updatePrice(input, dropdown, priceElement);
    });
  }

  toggleCartButton(input, cartButton);
  updatePrice(input, dropdown, priceElement);
}

function handleAddToCart(dropdown, input, cartButton, priceElement) {
  const ticketType = dropdown ? dropdown.options[dropdown.selectedIndex].value : null;
  const quantity = parseInt(input.value, 10);

  if (quantity <= 0 || !ticketType) {
    console.error("No valid input data.");
    return;
  }

  fetch(`${API_BASE_URL}/Order/Create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticketCategoryId: ticketType,
      numberOfTickets: quantity,
    }),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 400) {
      throw new Error("Bad request. Failed to save order.");
    } else {
      throw new Error("Unknown error occurred while saving order.");
    }
  })
  .then(data => {
    input.value = 0;
    dropdown.selectedIndex = 0;
    cartButton.disabled = true;
    priceElement.textContent = "";
  })
  .catch(error => {
    console.error("Error saving purchased event:", error);
  });
}

export function createEvent(event) {
  const eventCard = document.createElement("div");
  const formattedStartDate = formatDate(event.startDate);
  const formattedEndDate = formatDate(event.endDate);
  const displayDate =
    formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} – ${formattedEndDate}`;

  const contentMarkup = `
    <div class="event-card">
      <img src="${event.eventImage}" class="card-img-top" alt="${
        event.eventImage
      }">
      <div class="card-body">
        <header>
          <h2 class="event-title text-2xl font-bold">${event.eventName}</h2>
        </header>
        <div class="content">
          <p class="description text-gray-700">${event.eventDescription}</p>
          <p class="date text-gray-700">${displayDate}</p>
          <div class="order-options text-gray-700">
            ${createDropdown(event.ticketCategories)}
            ${createIncrementer()}
          </div>
          <div class="purchase-options text-gray-700">
            <button class="add-button">
              <img src="./src/assets/bag-plus-fill.svg" alt="Logo">
            </button>
            <span id="totalPrice" class="total-price"></span> 
          </div>
        </div>
      </div>
    </div>
  `;

  eventCard.innerHTML = contentMarkup;

  attachEvents(eventCard);

  return eventCard;
}
