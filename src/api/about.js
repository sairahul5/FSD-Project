import { mockAbout } from './mockData'

export function getAboutPage() {
  // return request('/api/about')
  return Promise.resolve(mockAbout);
}

export function listAboutContainers() {
  // return request('/api/admin/about/containers')
  return Promise.resolve(mockAbout);
}

export function createAboutContainer(payload) {
  // return request('/api/admin/about/containers', { method: 'POST', body: payload })
  const newContainer = { id: Date.now(), ...payload };
  mockAbout.push(newContainer);
  return Promise.resolve(newContainer);
}

export function updateAboutContainer(id, payload) {
  // return request(`/api/admin/about/containers/${id}`, { method: 'PUT', body: payload })
  const index = mockAbout.findIndex(c => c.id == id);
  if (index !== -1) {
    mockAbout[index] = { ...mockAbout[index], ...payload };
    return Promise.resolve(mockAbout[index]);
  }
  return Promise.resolve(null);
}

export function deleteAboutContainer(id) {
  // return request(`/api/admin/about/containers/${id}`, { method: 'DELETE' })
  const index = mockAbout.findIndex(c => c.id == id);
  if (index !== -1) mockAbout.splice(index, 1);
  return Promise.resolve();
}
