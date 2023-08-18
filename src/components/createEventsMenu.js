import {
  eventsFilterSortState as state,
  setEventsFilterState as setFilterState,
  setEventsSortState as setSortState,
  toggleDropdown,
  toggleSortButton,
  getEventTypes,
  getEventVenues,
  getFilteredSortedEvents
} from "../utils";
import { createTypeDropdownItem } from "./createTypeDropdown";
import { createVenueDropdownItem } from "./createVenueDropdown";
import { createSearchBarItem } from "./createSearchBar";

export function createEventsSearchBar() {
  const eventsSearchContainer = document.querySelector(".events-search");

  const searchBar = createSearchBarItem();

  eventsSearchContainer.append(searchBar);
}

export function createEventsFilterDropdowns(events) {
  const eventsFilterContainer = document.querySelector(".events-filter");

  const filterByLabel = document.createElement("h3");
  filterByLabel.innerText = "Filter by";
  eventsFilterContainer.appendChild(filterByLabel);

  const typeDropdown = createTypeDropdownItem(getEventTypes(events));
  const venueDropdown = createVenueDropdownItem(getEventVenues(events));

  const defaultTypeValue = "";
  const defaultVenueValue = "all";

  typeDropdown.addEventListener("change", function () {
    filterHandler();

    let typeState = (typeDropdown.value !== defaultTypeValue) ? "selected" : "default";
    toggleDropdown(typeDropdown, typeState);
  });

  venueDropdown.addEventListener("change", function () {
    filterHandler();

    let venueState = (venueDropdown.value !== defaultVenueValue) ? "selected" : "default";
    toggleDropdown(venueDropdown, venueState);
  });

  eventsFilterContainer.append(typeDropdown, venueDropdown);
}

export function createEventsSortButtons() {
  const eventsSortContainer = document.querySelector(".events-sort");

  const sortByLabel = document.createElement("h3");
  sortByLabel.innerText = "Sort by";
  eventsSortContainer.appendChild(sortByLabel);

  const dateButton = document.createElement("button");
  dateButton.className = "sort-button";
  dateButton.innerHTML = "Date";
  dateButton.dataset.type = "Date";

  const nameButton = document.createElement("button");
  nameButton.className = "sort-button";
  nameButton.innerHTML = "Name";
  nameButton.dataset.type = "Name";

  dateButton.addEventListener("click", function () {
    sortHandler(dateButton);
  });

  nameButton.addEventListener("click", function () {
    sortHandler(nameButton);
  });

  eventsSortContainer.append(dateButton, nameButton);
}

async function filterHandler() {
  const typeDropdown = document.getElementById("typeDropdown");
  const venueDropdown = document.getElementById("venueDropdown");

  setFilterState(venueDropdown.selectedOptions[0].dataset.venueId, typeDropdown.value);

  getFilteredSortedEvents();
}

function sortHandler(clickedButton) {
  const buttonType = clickedButton.dataset.type.toLowerCase();
  let previousButton;
  
  if (clickedButton.dataset.type === "Date") {
    previousButton = document.querySelector('button[data-type="Name"]');
  } else {
    previousButton = document.querySelector('button[data-type="Date"]');
  }
  if (state.criterion !== buttonType) {
    toggleSortButton(previousButton, "none");
  }
  if (
    state.sort.criterion === buttonType &&
    state.sort.direction === "ascending"
  ) {
    setSortState("none", "none");
    toggleSortButton(clickedButton, "none");
  } else if (
    state.sort.criterion === buttonType &&
    state.sort.direction === "descending"
  ) {
    setSortState(buttonType, "ascending");
    toggleSortButton(clickedButton, "ascending");
  } else {
    setSortState(buttonType, "descending");
    toggleSortButton(clickedButton, "descending");
  }

  getFilteredSortedEvents();
}
