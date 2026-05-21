/**
 * In-memory auth store so login and signup share the same users/tokens.
 * Resets on server restart. Replace with DB in production.
 */
export type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

const g = globalThis as typeof globalThis & {
  __auth_users?: Map<string, StoredUser>;
  __auth_tokens?: Map<string, string>;
};

export const users = (() => {
  if (!g.__auth_users) g.__auth_users = new Map();
  return g.__auth_users;
})();

export const tokens = (() => {
  if (!g.__auth_tokens) g.__auth_tokens = new Map();
  return g.__auth_tokens;
})();
