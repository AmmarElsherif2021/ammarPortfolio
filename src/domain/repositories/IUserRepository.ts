import { User } from "@/domain/entities/User";
// ─── Payload types ────────────────────────────────────────────────────────────
export type CreateUserPayload = Omit<User, "id" | "created_at" | "role">;
export type UpdateUserPayload = Partial<Omit<User, "id" | "created_at">>;
export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(payload: CreateUserPayload): Promise<User>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}
