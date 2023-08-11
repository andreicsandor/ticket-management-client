import { createEvent } from './components/createEventCard';
import { createOrder } from './components/createOrderCard';
import { fetchEvent } from './dto/getEvents';


export const addOrders = (orders) => {
  const ordersContainer = document.querySelector('.orders');
  ordersContainer.innerHTML = 'No orders available';

  if (orders.length) {
    ordersContainer.innerHTML = '';
    orders.forEach((order) => {
      let eventName;

      fetchEvent(order.eventId)
        .then((data) => {
          eventName = data.eventName;
          ordersContainer.appendChild(createOrder(order, eventName));
        });
    });
  }
};


export const addEvents = (events) => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = 'No events available';

  if (events.length) {
    eventsContainer.innerHTML = '';
    events.forEach((event) => {
      eventsContainer.appendChild(createEvent(event));
    });
  }
};


export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}


export function updatePrice(input, dropdown, priceElement) {
  const quantity = parseInt(input.value);
  let ticketPrice = 0;

  if (dropdown) {
      const selectedOption = dropdown.options[dropdown.selectedIndex];
      ticketPrice = parseFloat(selectedOption.getAttribute('data-price'));
  }
  
  if (quantity > 0) {
    const totalPrice = ticketPrice * quantity;
    // Using toLocaleString to format the number with commas
    const formattedTotalPrice = totalPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    priceElement.textContent = `RON ${formattedTotalPrice}`;
  } else {
    priceElement.textContent = '';
  }
}


export function toggleCartButton(input, cartButton) {
  const currentQuantity = parseInt(input.value);
  cartButton.disabled = currentQuantity <= 0;
}
