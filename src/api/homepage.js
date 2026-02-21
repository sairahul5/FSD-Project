import { mockHomepage, mockHomepageContainers } from './mockData'

export function getHomePage() {
  // return request('/api/homepage')
  return Promise.resolve(mockHomepage);
}

export function updateHomePage(payload) {
  // return request('/api/admin/homepage', { method: 'PUT', body: payload })
  Object.assign(mockHomepage, payload);
  return Promise.resolve(mockHomepage);
}

export function listHomePageContainers() {
  // return request('/api/admin/homepage/containers')
  return Promise.resolve(mockHomepageContainers);
}

export function createHomePageContainer(payload) {
  // return request('/api/admin/homepage/containers', { method: 'POST', body: payload })
  const newContainer = { id: Date.now(), ...payload };
  mockHomepageContainers.push(newContainer);
  return Promise.resolve(newContainer);
}

export function updateHomePageContainer(id, payload) {
  // return request(`/api/admin/homepage/containers/${id}`, { method: 'PUT', body: payload })
  const index = mockHomepageContainers.findIndex(c => c.id == id);
  if (index !== -1) {
    mockHomepageContainers[index] = { ...mockHomepageContainers[index], ...payload };
    return Promise.resolve(mockHomepageContainers[index]);
  }
  return Promise.resolve(null);
}

export function deleteHomePageContainer(id) {
  // return request(`/api/admin/homepage/containers/${id}`, { method: 'DELETE' })
  const index = mockHomepageContainers.findIndex(c => c.id == id);
  if (index !== -1) mockHomepageContainers.splice(index, 1);
  return Promise.resolve();
}
