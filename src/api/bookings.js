import { mockBookings } from './mockData'

export function createBooking(payload) {
  // return request('/api/bookings', { method: 'POST', body: payload })
  const newBooking = { id: Date.now(), ...payload, status: 'PENDING' };
  mockBookings.push(newBooking);
  return Promise.resolve(newBooking);
}

export function listBookingsForTourist(touristId) {
  // return request(`/api/bookings/tourist/${touristId}`)
  return Promise.resolve(mockBookings.filter(b => b.userId == touristId));
}

export function listBookingsForHost(hostId) {
  // return request(`/api/bookings/host/${hostId}`)
  // Assuming homestay owner logic is complex to mock fully relationally, return all or mock logic
  return Promise.resolve(mockBookings);
}
