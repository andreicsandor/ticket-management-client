import { API_BASE_URL } from "../config";

export async function fetchEvent(id) {
  const response = await fetch(`${API_BASE_URL}/Event/GetById?id=${id}`);
  const data = await response.json();
  return data;
}
