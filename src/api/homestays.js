import { mockHomestays } from './mockData'

export function searchHomestays(query) {
  // const params = query ? `?query=${encodeURIComponent(query)}` : ''
  // return request(`/api/homestays${params}`)
  return new Promise((resolve) => {
    setTimeout(() => {
	  if (!query) return resolve(mockHomestays);
	  const lowerQuery = query.toLowerCase();
	  const filtered = mockHomestays.filter(h => 
	    h.name.toLowerCase().includes(lowerQuery) || 
		h.location.toLowerCase().includes(lowerQuery)
	  );
      resolve(filtered)
    }, 500)
  })
}

export function getHomestay(id) {
  // return request(`/api/homestays/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const homestay = mockHomestays.find(h => h.id == id)
      if (homestay) resolve(homestay)
      else reject(new Error('Homestay not found'))
    }, 300)
  })
}

export function createHomestay(payload) {
  // return request('/api/homestays', { method: 'POST', body: payload })
  return new Promise((resolve) => {
      const newHomestay = { ...payload, id: Date.now() };
      mockHomestays.push(newHomestay);
      resolve(newHomestay);
  })
}

export function updateHomestay(id, payload) {
  // return request(`/api/homestays/${id}`, { method: 'PUT', body: payload })
  return new Promise((resolve) => {
      const index = mockHomestays.findIndex(h => h.id == id);
      if (index !== -1) {
          mockHomestays[index] = { ...mockHomestays[index], ...payload };
          resolve(mockHomestays[index]);
      } else {
        resolve(null);
      }
  })
}

export function deleteHomestay(id) {
  // return request(`/api/homestays/${id}`, { method: 'DELETE' })
  return new Promise((resolve) => {
      const index = mockHomestays.findIndex(h => h.id == id);
      if (index !== -1) {
          mockHomestays.splice(index, 1);
      }
      resolve();
  })
}
