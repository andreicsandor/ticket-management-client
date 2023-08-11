import { formatDate } from '../utils'


export function createOrder(order, eventName) {
    const orderCard = document.createElement('div');
    const formattedDate = formatDate(order.orderedAt);
    const displayDate = formattedDate;

    const contentMarkup = `
      <div class="order-card">
        <div class="card-body">
          <header>
            <h2 class="event-title">${eventName}</h2>
          </header>
          <div class="content">
            <p class="date text-gray-700">Ordered on: ${displayDate}</p>
            <div class="order-details text-gray-700">
              <p>Tickets: DUMMY TEXT</p>
            </div>
          </div>
        </div>
      </div>
    `;

    orderCard.innerHTML = contentMarkup;

    return orderCard;
}
