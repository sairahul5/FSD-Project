import { mockHomepage, mockHomepageContainers } from './mockData'

const getStoredHomepage = () => {
    const stored = localStorage.getItem('homepageStr');
    return stored ? JSON.parse(stored) : mockHomepage;
}

const saveHomepage = (data) => {
    localStorage.setItem('homepageStr', JSON.stringify(data));
}

const getStoredContainers = () => {
    const stored = localStorage.getItem('homepageContainersStr');
    return stored ? JSON.parse(stored) : mockHomepageContainers;
}

const saveContainers = (data) => {
    localStorage.setItem('homepageContainersStr', JSON.stringify(data));
}

export function getHomePage() {
  return Promise.resolve(getStoredHomepage());
}

export function updateHomePage(payload) {
  const current = getStoredHomepage();
  const updated = { ...current, ...payload };
  saveHomepage(updated);
  return Promise.resolve(updated);
}

export function listHomePageContainers() {
  return Promise.resolve(getStoredContainers());
}

export function createHomePageContainer(payload) {
  const containers = getStoredContainers();
  const newContainer = { id: Date.now(), ...payload };
  containers.push(newContainer);
  saveContainers(containers);
  return Promise.resolve(newContainer);
}

export function updateHomePageContainer(id, payload) {
  const containers = getStoredContainers();
  const index = containers.findIndex(c => c.id == id);
  if (index !== -1) {
    containers[index] = { ...containers[index], ...payload };
    saveContainers(containers);
    return Promise.resolve(containers[index]);
  }
  return Promise.resolve(null);
}

export function deleteHomePageContainer(id) {
  const containers = getStoredContainers();
  const index = containers.findIndex(c => c.id == id);
  if (index !== -1) {
      containers.splice(index, 1);
      saveContainers(containers);
  }
  return Promise.resolve();
}
