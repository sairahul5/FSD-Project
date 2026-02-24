import { mockAbout } from './mockData'

const getStoredAbout = () => {
    const stored = localStorage.getItem('aboutDataStr');
    return stored ? JSON.parse(stored) : mockAbout;
}

const saveAbout = (data) => {
    localStorage.setItem('aboutDataStr', JSON.stringify(data));
}

export function getAboutPage() {
  return Promise.resolve(getStoredAbout());
}

export function listAboutContainers() {
  return Promise.resolve(getStoredAbout());
}

export function createAboutContainer(payload) {
  const about = getStoredAbout();
  const newContainer = { id: Date.now(), ...payload };
  about.push(newContainer);
  saveAbout(about);
  return Promise.resolve(newContainer);
}

export function updateAboutContainer(id, payload) {
  const about = getStoredAbout();
  const index = about.findIndex(c => c.id == id);
  if (index !== -1) {
    about[index] = { ...about[index], ...payload };
    saveAbout(about);
    return Promise.resolve(about[index]);
  }
  return Promise.resolve(null);
}

export function deleteAboutContainer(id) {
  const about = getStoredAbout();
  const index = about.findIndex(c => c.id == id);
  if (index !== -1) {
    about.splice(index, 1);
    saveAbout(about);
  }
  return Promise.resolve();
}
