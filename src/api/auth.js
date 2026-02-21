import { mockUsers } from './mockData'
import { clearSession, setSession, getUser, getToken } from './session'

export async function login(email, password) {
  /*
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  if (!data.mfaRequired && data.token) {
    setSession({ token: data.token, user: { email: data.email, role: data.role, mfaEnabled: data.mfaEnabled } })
  }
  return data
  */
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const data = {
        token: 'dummy-jwt-token-' + Date.now(),
        email: user.email,
        role: user.role,
        mfaEnabled: false,
        mfaRequired: false
    };
    setSession({ token: data.token, user: { email: data.email, role: data.role, mfaEnabled: false } });
    return Promise.resolve(data);
  } else {
    return Promise.reject(new Error('Invalid email or password'));
  }
}

export async function register(fullName, email, password, role = 'TOURIST') {
  /*
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: { fullName, email, password, role },
  })
  setSession({ token: data.token, user: { email: data.email, role: data.role, mfaEnabled: data.mfaEnabled } })
  return data
  */
  const newUser = { id: Date.now(), name: fullName, email, password, role };
  mockUsers.push(newUser);
  const data = {
      token: 'dummy-jwt-token-' + Date.now(),
      email: newUser.email,
      role: newUser.role,
      mfaEnabled: false
  };
  setSession({ token: data.token, user: { email: data.email, role: data.role, mfaEnabled: false } });
  return Promise.resolve(data);
}

export function logout() {
  clearSession()
}

export async function verifyOtp(token, code) {
  /*
  const data = await request('/api/auth/verify-otp', {
    method: 'POST',
    body: { token, code },
  })
  if (data.token) {
    setSession({ token: data.token, user: { email: data.email, role: data.role, mfaEnabled: data.mfaEnabled } })
  }
  return data
  */
  // Mock verification always succeeds
  return Promise.resolve({ token: 'dummy-verified-token', email: 'user@example.com', role: 'USER', mfaEnabled: true });
}

export async function setupMfa() {
  // return request('/api/auth/setup-mfa', { method: 'POST' })
  return Promise.resolve({ secret: 'DUMMYSECRET', qrCode: 'data:image/png;base64,dummyqr' });
}

export async function enableMfa(code) {
  /*
  await request('/api/auth/enable-mfa', {
    method: 'POST',
    body: { code },
  })
  // Update session to reflect enabled status
  const current = getUser()
  if (current) {
    setSession({ token: getToken(), user: { ...current, mfaEnabled: true } })
  }
  */
  // Mock success
  const current = getUser()
  if (current) {
      setSession({ token: getToken(), user: { ...current, mfaEnabled: true } })
  }
  return Promise.resolve();
}

export async function resetPassword(email, code, newPassword) {
  // return request('/api/auth/reset-password', { method: 'POST', body: { email, code, newPassword } })
  return Promise.resolve();
}
