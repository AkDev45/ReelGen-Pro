
import { User } from '../types';

const STORAGE_KEY_SESSION = 'reelgen_current_user';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // --- Sign Up ---
  async signup(email: string, password: string, username: string, type: User['type']): Promise<User> {
    await delay(1000); // Simulate API latency

    // NOTE: Local DB storage removed. 
    // This creates a user session for the current browser session only.
    
    const newUser: User = {
      id: crypto.randomUUID(), // Unique ID for this session
      email,
      username: username || email.split('@')[0],
      type: type || 'creator',
      plan: 'Free',
      joinDate: new Date().toISOString(),
      analysisUsage: 0,
      projectUsage: 0
    };
    
    this.setSession(newUser);
    return newUser;
  },

  // --- Login ---
  async login(email: string, password: string): Promise<User> {
    await delay(1000);

    // NOTE: Local DB lookup removed.
    // MOCK LOGIN: Accepts any email/password for demo purposes.
    
    // We use a fixed ID for login so 'saved projects' (which use local storage) 
    // can persist for this demo user across reloads.
    const user: User = {
      id: 'demo-user-123', 
      email: email,
      username: email.split('@')[0],
      type: 'creator',
      plan: 'Free',
      joinDate: new Date().toISOString(),
      analysisUsage: 0,
      projectUsage: 0
    };

    this.setSession(user);
    return user;
  },

  // --- Plan Management ---
  async updateUserPlan(userId: string, newPlan: 'Free' | 'Pro'): Promise<User> {
    await delay(1000); 

    // Update the active session only
    const session = this.getCurrentUser();
    if (session) {
      const updatedSession = { ...session, plan: newPlan };
      this.setSession(updatedSession);
      return updatedSession;
    }

    throw new Error('User session not found.');
  },

  // --- Usage Management ---
  async incrementUsage(userId: string, type: 'analysis' | 'project'): Promise<User> {
    // Update the active session only
    const session = this.getCurrentUser();
    if (session) {
       const updatedSession = { ...session };
       if (type === 'analysis') {
         updatedSession.analysisUsage = (updatedSession.analysisUsage || 0) + 1;
       } else {
         updatedSession.projectUsage = (updatedSession.projectUsage || 0) + 1;
       }
       this.setSession(updatedSession);
       return updatedSession;
    }
    
    throw new Error('User session not found');
  },

  // --- Session Management ---
  setSession(user: User) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY_SESSION);
    return stored ? JSON.parse(stored) : null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }
};
