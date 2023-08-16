import { formatDate, formatPrice } from "../utils";
import { createEventEditCard } from "./createEventEditCard";
import { fetchEvent } from "../dto/getEvents";
import { API_BASE_URL } from "../config";

function attachEvents(orderCard, order) {
  const deleteButton = orderCard.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
    handleDelete(order);
  });

  const updateButton = orderCard.querySelector(".update-button");
  updateButton.addEventListener("click", function () {
    handleEdit(order);
  });

  orderCard.addEventListener("click", function () {
    handleEdit(order);
  });
}

function handleDelete(order) {
  fetch(`${API_BASE_URL}/Order/Delete?id=${order.orderId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error deleting the order:", error);
    });
}

async function handleEdit(order) {
  const relatedEvent = await fetchEvent(order.eventId);
  const editableCard = createEventEditCard(relatedEvent, order);

  const editSection = document.querySelector(".edit-section");
  editSection.innerHTML = "";

  editSection.appendChild(editableCard);
}

export const addOrders = (orders) => {
  const ordersContainer = document.querySelector(".orders");
  ordersContainer.innerHTML = "No orders available";

  if (orders.length) {
    ordersContainer.innerHTML = "";
    orders.forEach((order) => {
      let eventName;

      fetchEvent(order.eventId).then((data) => {
        eventName = data.eventName;
        ordersContainer.appendChild(createOrder(order, eventName));
      });
    });
  }
};

export function createOrder(order, eventName) {
  const orderCard = document.createElement("div");
  const formattedDate = formatDate(order.orderedAt);
  const formattedPrice = formatPrice(order.totalPrice);

  const contentMarkup = `
    <div class="order-card">
      <div class="card-body">
        <div>
          <header>
            <h2 class="event-title">${eventName}</h2>
          </header>
          <div class="content">
            <p class="text-gray-700">${order.numberOfTickets} ${
              order.ticketCategory
            } ticket${order.numberOfTickets > 1 ? "s" : ""}</p>
            <p class="text-gray-700">RON ${formattedPrice}</p>
            <p class="date text-gray-700">${formattedDate}</p>
          </div>
        </div>
        <div class="button-group">
          <button href="#" class="update-button">
            <img src="./src/assets/pencil-fill.svg" alt="Logo">
          </button>
          <button href="#" class="delete-button" data-order-id="${
            order.orderId
          }">
            <img src="./src/assets/trash-fill.svg" alt="Logo">
          </button>
        </div>
      </div>
    </div>
  `;

  orderCard.innerHTML = contentMarkup;

  attachEvents(orderCard, order);

  return orderCard;
}
