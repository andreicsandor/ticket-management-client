import { formatDate, updatePrice } from "../utils";
import { createDropdown } from "./createTCDropdown";
import { createIncrementer } from "./createIncrementer";
import { API_BASE_URL } from "../config";

function attachEvents(cardElement, order) {
  const decrementButton = cardElement.querySelector("#decrementButton");
  const incrementButton = cardElement.querySelector("#incrementButton");
  const saveButton = cardElement.querySelector(".save-button");
  const input = cardElement.querySelector(".quantity-input");
  const dropdown = cardElement.querySelector(".ticket-category-dropdown");
  const priceElement = cardElement.querySelector("#totalPrice");

  decrementButton.addEventListener("click", function () {
    if (input.value > input.min) {
      input.value = parseInt(input.value, 10) - 1;
    }
    updatePrice(input, dropdown, priceElement);
  });

  incrementButton.addEventListener("click", function () {
    if (input.value < input.max) {
      input.value = parseInt(input.value, 10) + 1;
    }
    updatePrice(input, dropdown, priceElement);
  });

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.value = 0;
    }
    updatePrice(input, dropdown, priceElement);
  });

  input.addEventListener("input", function () {
    updatePrice(input, dropdown, priceElement);
  });

  saveButton.addEventListener("click", function () {
    handleUpdate(cardElement, order);
  });

  if (dropdown) {
    dropdown.addEventListener("change", function () {
      updatePrice(input, dropdown, priceElement);
    });
  }

  updatePrice(input, dropdown, priceElement);
}

function handleUpdate(cardElement, order) {
  const ticketType = cardElement.querySelector(".ticket-category-dropdown").selectedOptions[0].text;
  const quantity = parseInt(cardElement.querySelector(".quantity-input").value);

  if (quantity <= 0 || !ticketType) {
    console.error("No valid input data.");
    return;
  }

  fetch(`${API_BASE_URL}/Order/Patch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: order.orderId,
      ticketCategory: ticketType,
      numberOfTickets: quantity,
    }),
  })
  .then(response => {
    if (response.ok) {
      location.reload();
    } else if (response.status === 404) {
      throw new Error("Update failed: Not found");
    } else {
      throw new Error("Unknown error occurred");
    }
  })
  .catch(error => {
    console.error("Error updating order:", error);
  });
}

export function createEventEditCard(event, order) {
  const eventCard = document.createElement("div");
  const formattedStartDate = formatDate(event.startDate);
  const formattedEndDate = formatDate(event.endDate);
  const displayDate =
    formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} – ${formattedEndDate}`;

  const contentMarkup = `
      <div class="event-edit-card">
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
              <button class="save-button">
                Save
              </button>
              <span id="totalPrice" class="total-price"></span> 
            </div>
          </div>
        </div>
      </div>
    `;

  eventCard.innerHTML = contentMarkup;

  const dropdown = eventCard.querySelector(".ticket-category-dropdown");
  if (dropdown) {
    const optionToSelect = dropdown.querySelector(
      `option[value="${order.ticketCategory}"]`
    );
    if (optionToSelect) {
      optionToSelect.selected = true;
    }
  }

  const quantityInput = eventCard.querySelector("#quantityInput");
  quantityInput.value = order.numberOfTickets;

  attachEvents(eventCard, order);

  return eventCard;
}
