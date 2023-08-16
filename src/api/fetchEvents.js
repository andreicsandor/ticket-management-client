import { API_BASE_URL } from "../config";

export async function getEvent(id) {
  const response = await fetch(`${API_BASE_URL}/Event/GetById?id=${id}`);
  const data = await response.json();
  return data;
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/Event/GetAll`);
  const data = await response.json();
  return data;
}
