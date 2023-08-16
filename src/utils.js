import { createEventCard } from "./components/createEventCard";
import { createOrderCard } from "./components/createOrderCard";
import { getEvent } from "./api/fetchEvents";

export const addOrderCards = (orders) => {
  resetEditPanel();

  const ordersContainer = document.querySelector(".orders");
  ordersContainer.innerHTML = "No orders available";

  if (orders.length) {
    ordersContainer.innerHTML = "";
    orders.forEach((order) => {
      getEvent(order.eventId).then((data) => {
        const eventName = data.eventName;
        ordersContainer.appendChild(createOrderCard(order, eventName));
      });
    });
  }
};

export const addEventCards = (events) => {
  const eventsContainer = document.querySelector(".events");
  eventsContainer.innerHTML = "No events available";

  if (events.length) {
    eventsContainer.innerHTML = "";
    events.forEach((event) => {
      eventsContainer.appendChild(createEventCard(event));
    });
  }
};

export function refreshOrderCard(order) {
  const orderCardToUpdate = document.querySelector(
    `#order-card-${order.orderId}`
  );
  const parentNode = orderCardToUpdate.parentNode;

  getEvent(order.eventId).then((data) => {
      const eventName = data.eventName;
      const updatedOrderCard = createOrderCard(order, eventName);
      parentNode.replaceChild(updatedOrderCard, orderCardToUpdate);
    })
};

export function resetEditPanel() {
  const editSection = document.querySelector(".edit-section");

  const contentMarkup = `
        <img src="./src/assets/bag-fill.svg" alt="Logo" style="margin-bottom: 20px">
        <h2 class="edit-section-title">Manage Your Orders</h2>
    `;

  editSection.innerHTML = "";
  editSection.innerHTML = contentMarkup;
}

export function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatPrice(price) {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function updatePriceItem(input, dropdown, priceElement) {
  const quantity = parseInt(input.value);
  let ticketPrice = 0;

  if (dropdown) {
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    ticketPrice = parseFloat(selectedOption.getAttribute("data-price"));
  }

  if (quantity > 0) {
    const totalPrice = ticketPrice * quantity;
    const formattedTotalPrice = formatPrice(totalPrice);
    priceElement.textContent = `RON ${formattedTotalPrice}`;
  } else {
    priceElement.textContent = "";
  }
}

export function toggleCartButton(input, cartButton) {
  const currentQuantity = parseInt(input.value);
  cartButton.disabled = currentQuantity <= 0;
}
