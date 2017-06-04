import Base from './base';

export default class MemoryCache extends Base {
  constructor() {
    super();

    if (MemoryCache.prototype.singleton) {
      return MemoryCache.prototype.singleton;
    }

    this.store = {};

    return MemoryCache.prototype.singleton = this;
  }

  get(key) {
    return this.store[key];
  }

  set(key, value) {
    this.store[key] = value;
  }
}
