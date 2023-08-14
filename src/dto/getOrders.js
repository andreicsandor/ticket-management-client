import { API_BASE_URL } from "../config";

export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/Order/GetAll`);
  const data = await response.json();
  return data;
}
