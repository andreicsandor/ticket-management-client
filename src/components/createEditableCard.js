import { formatDate, updatePriceItem, resetEditPanel, refreshOrderCard } from "../utils";
import { createDropdownItem } from "./createDropdown";
import { createIncrementerItem } from "./createIncrementer";
import { updateOrder } from "../api/updateOrder";

export function createEditableCard(event, order) {
  const eventCard = document.createElement("div");
  const formattedStartDate = formatDate(event.startDate);
  const formattedEndDate = formatDate(event.endDate);
  const displayDate =
    formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} – ${formattedEndDate}`;

  const contentMarkup = `
      <div class="order-edit-card">
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
              ${createDropdownItem(event.ticketCategories)}
              ${createIncrementerItem()}
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

function updateHandler(orderCardElement, order) {
  const orderId = order.orderId;
  const newTicketType = orderCardElement.querySelector(
    ".ticket-category-dropdown"
  ).selectedOptions[0].text;
  const newQuantity = parseInt(
    orderCardElement.querySelector(".quantity-input").value
  );

  if (
    (newTicketType == order.ticketCategory &&
      newQuantity == order.numberOfTickets) ||
    !newTicketType ||
    newQuantity <= 0
  ) {
    console.error("No valid input data.");
    return;
  }

  order.numberOfTickets = newQuantity;
  order.ticketCategory = newTicketType;

  updateOrder(orderId, newTicketType, newQuantity)
    .then(() => {
      refreshOrderCard(order);
      resetEditPanel();
    })
    .catch((error) => {});
}

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
    updatePriceItem(input, dropdown, priceElement);
  });

  incrementButton.addEventListener("click", function () {
    if (input.value < input.max) {
      input.value = parseInt(input.value, 10) + 1;
    }
    updatePriceItem(input, dropdown, priceElement);
  });

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.value = 0;
    }
    updatePriceItem(input, dropdown, priceElement);
  });

  input.addEventListener("input", function () {
    updatePriceItem(input, dropdown, priceElement);
  });

  saveButton.addEventListener("click", function () {
    updateHandler(cardElement, order);
  });

  if (dropdown) {
    dropdown.addEventListener("change", function () {
      const selectedCategory = dropdown.selectedOptions[0].text;
      updatePriceItem(input, dropdown, priceElement);
    });
  }

  updatePriceItem(input, dropdown, priceElement);
}
