// ─── Entity interface (mirrors the `contact_submissions` table) ───────────────

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  subject?: string;
  read: boolean;
  created_at: string;
}

// ─── Payload type (what the contact form POSTs) ───────────────────────────────

export type CreateContactPayload = Omit<ContactSubmission, "id" | "read" | "created_at">;