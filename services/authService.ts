
import { User } from '../types';

const STORAGE_KEY_USERS = 'reelgen_users';
const STORAGE_KEY_SESSION = 'reelgen_current_user';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // --- Sign Up ---
  async signup(email: string, password: string, username: string, type: User['type']): Promise<User> {
    await delay(1000); // Simulate API latency

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    
    // Check if user exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists with this email.');
    }

    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      email,
      password, // In a real app, never store plain text passwords!
      username: username || email.split('@')[0],
      type: type || 'creator',
      plan: 'Free',
      joinDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    
    // Auto login after signup
    this.setSession(newUser);
    return newUser;
  },

  // --- Login ---
  async login(email: string, password: string): Promise<User> {
    await delay(1000);

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    this.setSession(user);
    return user;
  },

  // --- Session Management ---
  setSession(user: User) {
    // Don't store password in session
    const { password, ...safeUser } = user as any;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(safeUser));
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY_SESSION);
    return stored ? JSON.parse(stored) : null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }
};
