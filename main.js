import { addEventCards, addOrderCards, resetEditPanel } from "./src/utils";
import { getOrders } from "./src/api/fetchOrders";
import { getEvents } from "./src/api/fetchEvents";
import { createOrdersSortButtons } from "./src/components/createOrdersMenu";
import { createEventsSearchBar, createEventsFilterDropdowns, createEventsSortButtons } from "./src/components/createEventsMenu";

export const toastrOptions = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

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
          <div class="events-menu">
            <div class="events-search"></div>
            <div class="events-filter"></div>
            <div class="events-sort"></div>
          </div>
          <div class="events"></div>
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
          <div class="orders-sort"></div>
          <div class="orders"></div>
        </div>
        <div class="edit-section"></div>
      </div>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener("popstate", () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function renderHomePage() {
  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getHomePageTemplate();
  
  getEvents().then((data) => {
    const events = data;
    addEventCards(events);
    createEventsSearchBar();
    createEventsSortButtons();
    createEventsFilterDropdowns(events);
  });
}

function renderOrdersPage() {
  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  getOrders().then((data) => {
    const orders = data;
    addOrderCards(orders);
    resetEditPanel();
    createOrdersSortButtons();
  });
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector(".main-content-component");
  mainContentDiv.innerHTML = "";

  if (url === "/") {
    renderHomePage();
  } else if (url === "/orders") {
    renderOrdersPage();
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
