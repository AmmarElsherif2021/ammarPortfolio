import { type Author } from "./author";
import { type Post } from "./post";

export type Project = {
    slug: string;
    title: string;
    description: string; // Short summary of the project
    githubUrl: string;
    liveDemoUrl?: string; // Optional: link to live demo
    coverImage?: string;
    author: Author;
    post: Post; // Detailed post describing the project
    tags: string[]; // Languages, frameworks, technologies used
    startDate?: string;
    endDate?: string;
    featured?: boolean; // Optional: highlight in portfolio
};
