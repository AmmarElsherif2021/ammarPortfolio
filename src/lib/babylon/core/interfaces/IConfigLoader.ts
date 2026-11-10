import { AppConfig } from "../../types/config.types";

/**
 * Sole responsibility: fetch + parse configuration from *some* source.
 * Today that source is a JSON file; tomorrow it could be a REST API
 * or a CMS. Consumers depend on this abstraction, never on `fetch` directly,
 * so swapping the source later doesn't ripple through the codebase (DIP).
 */
export interface IConfigLoader {
  load(path: string): Promise<AppConfig>;
}
