import { createEventCard } from "./components/createEventCard";
import { createOrderCard } from "./components/createOrderCard";
import { getEvent } from "./api/fetchEvents";

// Addings cards functions

export const addOrderCards = async (orders) => {
  const ordersContainer = document.querySelector(".orders");
  ordersContainer.innerHTML = "No orders available";

  if (orders.length) {
    ordersContainer.innerHTML = "";

    let sortedOrders;

    switch (ordersSortConfig.criterion) {
      case "date":
        sortedOrders =
          ordersSortConfig.direction === "ascending"
            ? sortOrdersByDate(orders)
            : sortOrdersByDate(orders, "descending");
        break;
      case "price":
        sortedOrders =
          ordersSortConfig.direction === "ascending"
            ? sortOrdersByPrice(orders)
            : sortOrdersByPrice(orders, "descending");
        break;
      case "none":
        sortedOrders = orders;
        break;
      default:
        throw new Error("Invalid sort criterion.");
    }

    for (let order of sortedOrders) {
      const data = await getEvent(order.eventId);
      const eventName = data.eventName;
      ordersContainer.appendChild(createOrderCard(order, eventName));
    }
  }
};

export const addEventCards = (events) => {
  const eventsContainer = document.querySelector(".events");
  eventsContainer.innerHTML = "No events available";

  if (events.length) {
    eventsContainer.innerHTML = "";

    let sortedEvents;

    switch (eventsSortConfig.criterion) {
      case "date":
        sortedEvents =
          eventsSortConfig.direction === "ascending"
            ? sortEventsByDate(events)
            : sortEventsByDate(events, "descending");
        break;
      case "name":
        sortedEvents =
          eventsSortConfig.direction === "ascending"
            ? sortEventsByName(events)
            : sortEventsByName(events, "descending");
        break;
      case "none":
        sortedEvents = events;
        break;
      default:
        throw new Error("Invalid sort criterion.");
    }

    for (let event of sortedEvents) {
      eventsContainer.appendChild(createEventCard(event));
    }
  }
};

// Resetting elements fucntions

export function refreshOrderCard(order) {
  const orderCardToUpdate = document.querySelector(
    `#order-card-${order.orderId}`
  );
  const parentNode = orderCardToUpdate.parentNode;

  getEvent(order.eventId).then((data) => {
    const eventName = data.eventName;
    const updatedOrderCard = createOrderCard(order, eventName);
    parentNode.replaceChild(updatedOrderCard, orderCardToUpdate);
  });
}

export function resetEditPanel() {
  const editSection = document.querySelector(".edit-section");

  const contentMarkup = `
        <img src="./src/assets/bag-fill.svg" alt="Logo" style="margin-bottom: 20px">
        <h2 class="edit-section-title">Manage Your Orders</h2>
    `;

  editSection.innerHTML = "";
  editSection.innerHTML = contentMarkup;
}

// Formatting functions

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

// Updating elements functions

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

export function toggleSortButton(button, state) {
  if (state === "ascending") {
    button.innerHTML = `<span class="ascending-icon"></span> ${button.dataset.type}`;
    button.className = "sort-button active";
  } else if (state === "descending") {
    button.innerHTML = `<span class="descending-icon"></span> ${button.dataset.type}`;
    button.className = "sort-button active";
  } else {
    button.innerHTML = button.dataset.type;
    button.className = "sort-button";
  }
}

// Sorting functions & constants for Orders

export const ordersSortConfig = {
  criterion: "none",
  direction: "none",
};

export function setOrdersSortConfig(criterion, direction = "none") {
  ordersSortConfig.criterion = criterion;
  ordersSortConfig.direction = direction;
}

export function sortOrdersByDate(orders, direction = "ascending") {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.orderedAt);
    const dateB = new Date(b.orderedAt);

    if (direction === "ascending") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

export function sortOrdersByPrice(orders, direction = "ascending") {
  return [...orders].sort((a, b) => {
    const priceA = a.totalPrice;
    const priceB = b.totalPrice;

    if (direction === "ascending") {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });
}

// Sorting functions & constants for Events

export const eventsSortConfig = {
  criterion: "none",
  direction: "none",
};

export function setEventsSortConfig(criterion, direction = "none") {
  eventsSortConfig.criterion = criterion;
  eventsSortConfig.direction = direction;
}

export function sortEventsByDate(events, direction = "ascending") {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    if (direction === "ascending") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

export function sortEventsByName(events, direction = "ascending") {
  return [...events].sort((a, b) => {
    const nameA = a.eventName.toUpperCase(); // Ignore case
    const nameB = b.eventName.toUpperCase(); // Ignore case

    if (nameA < nameB) {
      return direction === "ascending" ? -1 : 1;
    }

    if (nameA > nameB) {
      return direction === "ascending" ? 1 : -1;
    }

    // names are equal
    return 0;
  });
}
