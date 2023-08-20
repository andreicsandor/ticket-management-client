export function addEventsLoader() {
  const loader = document.querySelector("#loader");
  loader.classList.remove("hidden");
}

export function removeEventsLoader() {
  const loader = document.querySelector("#loader");
  loader.classList.add("hidden");
}

export function addOrdersLoader() {
  const loader = document.querySelector("#loader");
  loader.classList.remove("hidden"); 
}

export function removeOrdersLoader() {
  const loader = document.querySelector("#loader");
  loader.classList.add("hidden");
}