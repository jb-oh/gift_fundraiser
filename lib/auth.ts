import { User, UserType } from './types';

const STORAGE_KEY_USERS = 'gift_fundraiser_users';
const STORAGE_KEY_CURRENT_USER = 'gift_fundraiser_current_user';

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get all users from localStorage
function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

// Save user to localStorage
function saveUser(user: User): void {
  try {
    const users = getAllUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Failed to save user');
  }
}

// Mock signup function
export function signup(name: string, email: string, userType: UserType): User {
  // Check if user already exists
  const users = getAllUsers();
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser: User = {
    id: generateId(),
    name,
    email,
    userType,
    createdAt: new Date().toISOString(),
  };

  saveUser(newUser);
  setCurrentUser(newUser);

  return newUser;
}

// Mock login function
export function login(email: string): User {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('User not found');
  }

  setCurrentUser(user);
  return user;
}

// Logout function
export function logout(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Set current user
function setCurrentUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user:', error);
    throw new Error('Failed to set current user');
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Check if current user is a host
export function isHost(): boolean {
  const user = getCurrentUser();
  return user?.userType === 'host';
}
