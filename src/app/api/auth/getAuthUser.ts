import { users, tokens } from "./store";

export type AuthUser = { id: string; email: string };

/**
 * Resolves the current user from the request's Bearer token.
 * Returns null if missing or invalid (caller should respond 401).
 */
export function getAuthUserFromRequest(request: Request): AuthUser | null {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;
  const email = tokens.get(token);
  if (!email) return null;
  const user = users.get(email);
  if (!user) return null;
  return { id: user.id, email: user.email };
}
