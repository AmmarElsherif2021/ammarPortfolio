// ─── Literal / union types ────────────────────────────────────────────────────

export type UserRole = "user" | "admin";

// ─── Entity interface (mirrors the `users` table) ─────────────────────────────

export interface User {
  id: string; // UUID – matches Supabase auth.users(id)
  email: string;
  name: string;
  role: UserRole;
  bio?: string;
  avatar_url?: string;
  created_at: string; // ISO timestamp string coming from Postgres
}

// ─── Payload types (for API requests, not full DB rows) ───────────────────────

export type CreateUserPayload = Omit<User, "id" | "created_at" | "role">;
export type UpdateUserPayload = Partial<Omit<User, "id" | "created_at">>;