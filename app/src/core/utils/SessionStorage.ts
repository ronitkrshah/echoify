class SessionStorage {
  private storage: Map<string, any>;

  constructor() {
    this.storage = new Map<string, any>();
  }

  set(key: string, value: any): void {
    this.storage.set(key, value);
  }

  get<T = any>(key: string): T | undefined {
    return this.storage.get(key);
  }

  has(key: string): boolean {
    return this.storage.has(key);
  }

  delete(key: string): boolean {
    return this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  keys(): string[] {
    return Array.from(this.storage.keys());
  }
}

export default new SessionStorage();
