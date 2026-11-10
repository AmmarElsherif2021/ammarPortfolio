// ─── Literal / union types ────────────────────────────────────────────────────

export type ResourceTopic =
  | "DSA"
  | "System Design"
  | "Next.js"
  | "React"
  | "TypeScript"
  | string; // open-ended so new topics don't break the type

export type ResourceCategory = "Tutorial" | "Article" | "Video" | "Course" | string;

export type ResourceDifficulty = "Beginner" | "Intermediate" | "Advanced";

// ─── Entity interface (mirrors the `learning_resources` table) ────────────────

export interface LearningResource {
  id: number;
  title: string;
  topic: ResourceTopic;
  url?: string;
  category?: ResourceCategory;
  difficulty?: ResourceDifficulty;
  description?: string;
  created_at: string;
}

// ─── Payload types ────────────────────────────────────────────────────────────

export type CreateLearningResourcePayload = Omit<LearningResource, "id" | "created_at">;
export type UpdateLearningResourcePayload = Partial<CreateLearningResourcePayload>;