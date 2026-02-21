import { mockChats } from './mockData'

export function sendChatMessage(payload) {
  // return request('/api/chats', { method: 'POST', body: payload })
  const newMessage = { id: Date.now(), ...payload, timestamp: new Date().toISOString() };
  mockChats.push(newMessage);
  return Promise.resolve(newMessage);
}

export function listChatMessages() {
  // return request('/api/chats')
  return Promise.resolve(mockChats);
}
