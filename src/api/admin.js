import { mockUsers, mockHomestays, mockStats, mockBookings, mockChats } from './mockData'

export function listUsers() {
  // return request('/api/admin/users')
  return Promise.resolve(mockUsers)
}

export function getAdminStats() {
  // return request('/api/admin/stats')
  return Promise.resolve(mockStats)
}

export function createUser(payload) {
  // return request('/api/admin/users', { method: 'POST', body: payload })
  const newUser = { id: Date.now(), ...payload };
  mockUsers.push(newUser);
  return Promise.resolve(newUser);
}

export function updateUser(id, payload) {
  // return request(`/api/admin/users/${id}`, { method: 'PUT', body: payload })
  const index = mockUsers.findIndex(u => u.id == id);
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...payload };
    return Promise.resolve(mockUsers[index]);
  }
  return Promise.resolve(null);
}

export function deleteUser(id) {
  // return request(`/api/admin/users/${id}`, { method: 'DELETE' })
  const index = mockUsers.findIndex(u => u.id == id);
  if (index !== -1) mockUsers.splice(index, 1);
  return Promise.resolve();
}

export function listAdminHomestays(filters = {}) {
  /*
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      params.set(key, value)
    }
  })
  const query = params.toString()
  return request(query ? `/api/admin/homestays?${query}` : '/api/admin/homestays')
  */
  return Promise.resolve(mockHomestays);
}

export function createAdminHomestay(payload) {
  // return request('/api/admin/homestays', { method: 'POST', body: payload })
  const newHomestay = { id: Date.now(), ...payload };
  mockHomestays.push(newHomestay);
  return Promise.resolve(newHomestay);
}

export function updateAdminHomestay(id, payload) {
  // return request(`/api/admin/homestays/${id}`, { method: 'PUT', body: payload })
  const index = mockHomestays.findIndex(h => h.id == id);
  if (index !== -1) {
      mockHomestays[index] = { ...mockHomestays[index], ...payload };
      return Promise.resolve(mockHomestays[index]);
  }
  return Promise.resolve(null);
}

export function deleteAdminHomestay(id) {
  // return request(`/api/admin/homestays/${id}`, { method: 'DELETE' })
  const index = mockHomestays.findIndex(h => h.id == id);
  if (index !== -1) mockHomestays.splice(index, 1);
  return Promise.resolve();
}

export function listAdminBookings() {
  // return request('/api/admin/bookings')
  return Promise.resolve(mockBookings);
}

export function updateAdminBooking(id, payload) {
  // return request(`/api/admin/bookings/${id}`, { method: 'PUT', body: payload })
  const index = mockBookings.findIndex(b => b.id == id);
  if (index !== -1) {
    mockBookings[index] = { ...mockBookings[index], ...payload };
    return Promise.resolve(mockBookings[index]);
  }
  return Promise.resolve(null);
}

export function deleteAdminBooking(id) {
  // return request(`/api/admin/bookings/${id}`, { method: 'DELETE' })
  const index = mockBookings.findIndex(b => b.id == id);
  if (index !== -1) mockBookings.splice(index, 1);
  return Promise.resolve();
}

export function listAdminChats() {
  // return request('/api/admin/chats')
  return Promise.resolve(mockChats);
}

export function deleteAdminChat(id) {
  // return request(`/api/admin/chats/${id}`, { method: 'DELETE' })
  const index = mockChats.findIndex(c => c.id == id);
  if (index !== -1) mockChats.splice(index, 1);
  return Promise.resolve();
}
