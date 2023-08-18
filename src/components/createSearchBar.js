export function createSearchBarItem() {
  const searchBarContainer = document.createElement("div");
  searchBarContainer.className = "search-bar";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search...";

  const searchButton = document.createElement("button");
  searchButton.innerHTML = "🔍";

  searchBarContainer.appendChild(searchInput);
  searchBarContainer.appendChild(searchButton);

  searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    // TO DO
});

  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const query = searchInput.value;
      // TO DO
    }
  });

  return searchBarContainer;
}
