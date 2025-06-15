import { MMKV } from "react-native-mmkv";

export default class LocalStorage {
  private static _storage = new MMKV();

  private constructor() {}

  public static getItem(key: string) {
    return this._storage.getString(key);
  }

  public static setItem(key: string, value: string) {
    return this._storage.set(key, value);
  }

  public static removeItem(key: string) {
    return this._storage.delete(key);
  }
}
