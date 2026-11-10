import { IConfigLoader } from "../interfaces/IConfigLoader";
import { AppConfig } from "../../types/config.types";

/**
 * Loads AppConfig from a static JSON file via fetch.
 * This is the ONLY class in the app that knows the config lives in a JSON file -
 * everything else just calls `IConfigLoader.load()`.
 */
export class JsonConfigLoader implements IConfigLoader {
  public async load(path: string): Promise<AppConfig> {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(
        `JsonConfigLoader: failed to load config at "${path}" (HTTP ${response.status})`
      );
    }

    return (await response.json()) as AppConfig;
  }
}
