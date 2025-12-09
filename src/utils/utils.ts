import { AnyObject } from "@types";

export class Utils {
  static nvl<T>(...values: Array<T | undefined>): T | null {
    const result = values.find((value) => value != null);
    return result === undefined ? null : result;
  }

  static omit<T extends AnyObject, Key extends keyof T>(
    entity: T,
    ...keys: Key[]
  ): Omit<T, Key> {
    const result = { ...entity };

    for (const key of keys) {
      delete result[key];
    }

    return result as Omit<T, Key>;
  }
}
