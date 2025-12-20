
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
      joinDate: new Date().toISOString(),
      analysisUsage: 0,
      projectUsage: 0
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

  // --- Plan Management ---
  async updateUserPlan(userId: string, newPlan: 'Free' | 'Pro'): Promise<User> {
    await delay(1500); // Simulate payment processing delay

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === userId ? { ...u, plan: newPlan } : u
    );
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

    // Update current session if it matches the user being updated
    const session = this.getCurrentUser();
    if (session && session.id === userId) {
      const updatedSession = { ...session, plan: newPlan };
      this.setSession(updatedSession);
      return updatedSession;
    }

    throw new Error('User session not found.');
  },

  // --- Usage Management ---
  async incrementUsage(userId: string, type: 'analysis' | 'project'): Promise<User> {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) throw new Error('User not found');

    const currentUser = users[userIndex];
    if (type === 'analysis') {
      currentUser.analysisUsage = (currentUser.analysisUsage || 0) + 1;
    } else {
      currentUser.projectUsage = (currentUser.projectUsage || 0) + 1;
    }

    users[userIndex] = currentUser;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    // Update Session
    const session = this.getCurrentUser();
    if (session && session.id === userId) {
      const updatedSession = { ...session, ...currentUser };
      // Remove password from session just in case
      const { password, ...safeUser } = updatedSession;
      this.setSession(safeUser as User);
      return safeUser as User;
    }

    return currentUser;
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
