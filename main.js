import { addEvents, addOrders } from './src/utils'
import { fetchOrders } from './src/dto/getOrders';
import { fetchTicketEvents } from './src/dto/getTicketEvents';


// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}


// HTML templates
function getHomePageTemplate() {
  return `
    <div id="content" >
      <div class="events-container">
        <div class="events-section">
          <div class="events">
          </div>
        </div>
      </div>
    </div>
  `;
}


function getOrdersPageTemplate() {
  return `
    <div id="content">
      <div class="orders-container">
        <div class="orders-section">
          <div class="orders"></div>
        </div>
        <div class="edit-section">
        </div>
      </div>
    </div>
  `;
}


function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}


function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}


function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}


function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}


function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  let events;

  fetchTicketEvents()
    .then((data) => {
      events = data;
      addEvents(events);
    });
}


function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  let orders;

  fetchOrders()
    .then((data) => {
      orders = data;
      addOrders(orders);
    });
}


// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage();
  }
}


// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
