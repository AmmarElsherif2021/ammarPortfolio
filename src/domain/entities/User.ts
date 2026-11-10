// ─── Literal / union types ────────────────────────────────────────────────────

export type UserRole = "recruiter" | "admin" | "guest";

// ─── Entity interface (mirrors the `users` table) ─────────────────────────────

export interface User {
  id: string; // UUID – matches Supabase auth.users(id)
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  bio?: string;
  avatar_url?: string;
  created_at: string; // ISO timestamp string used in DBs
}
