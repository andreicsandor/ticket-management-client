import { API_BASE_URL } from '../config'


export async function fetchTicketEvents() {
  const response = await fetch(`${API_BASE_URL}/Event/GetAll`);
  const data = await response.json();
  return data;
}