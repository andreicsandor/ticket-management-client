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
  const ticketCategory = cardElement.querySelector(
    ".ticket-category-dropdown"
  ).value;
  const numberOfTickets = parseInt(
    cardElement.querySelector(".quantity-input").value
  );

  const payload = {
    OrderId: order.orderId,
    TicketCategory: ticketCategory,
    NumberOfTickets: numberOfTickets,
  };

  fetch(`${API_BASE_URL}/Order/Patch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        location.reload();
      } else {
        console.error("Failed to update order");
      }
    })
    .catch((error) => {
      console.error("Error updating the order:", error);
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
              ${createDropdown(event.ticketCategories, order.ticketCategory)}
              ${createIncrementer()}
            </div>
            <div class="purchase-options text-gray-700">
              <button class="save-button">
                Save Order
              </button>
              <span id="totalPrice" class="total-price"></span> 
            </div>
          </div>
        </div>
      </div>
    `;

  eventCard.innerHTML = contentMarkup;

  attachEvents(eventCard, order);

  return eventCard;
}
