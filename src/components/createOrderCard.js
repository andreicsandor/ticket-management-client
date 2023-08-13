import { formatDate, formatPrice } from '../utils'


export function createOrder(order, eventName) {
  const orderCard = document.createElement('div');
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
            <p class="text-gray-700">${order.numberOfTickets} ${order.ticketCategory} ticket${order.numberOfTickets > 1 ? 's' : ''}</p>
            <p class="text-gray-700">RON ${formattedPrice}</p>
            <p class="date text-gray-700">${formattedDate}</p>
          </div>
        </div>
        <div class="button-group">
          <button href="#" class="update-button">
            <img src="./src/assets/pencil-fill.svg" alt="Logo">
          </button>
          <button href="#" class="delete-button">
            <img src="./src/assets/trash-fill.svg" alt="Logo">
          </button>
        </div>
      </div>
    </div>
  `;

  orderCard.innerHTML = contentMarkup;

  return orderCard;
}
