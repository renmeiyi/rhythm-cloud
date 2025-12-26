/**
 * 音频资源对象
 * @typedef {Object} AudioResource
 * @property {string} id - 唯一标识
 * @property {string} url - 音频文件地址
 * @property {HTMLAudioElement} [audio] - 可选的 HTMLAudioElement 实例
 */

/**
 * 资源管理类
 */
export class ResourceManager {
  constructor() {
    /** @type {Map<string, AudioResource>} */
    this.cache = new Map(); // 音频缓存
  }

  /**
   * 加载单个音频资源
   * @param {string} id - 资源唯一标识
   * @param {string} url - 音频地址
   * @returns {Promise<AudioResource>}
   */
  load(id, url) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(id)) {
        resolve(this.cache.get(id));
        return;
      }

      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => {
        const resource = { id, url, audio };
        this.cache.set(id, resource);
        resolve(resource);
      });
      audio.addEventListener('error', (e) => {
        reject(new Error(`Failed to load audio ${url}: ${e.message}`));
      });
    });
  }

  /**
   * 批量预加载资源
   * @param {Array<{id: string, url: string}>} list
   * @returns {Promise<AudioResource[]>}
   */
  preload(list) {
    return Promise.all(list.map(item => this.load(item.id, item.url)));
  }

  /**
   * 获取已缓存资源
   * @param {string} id
   * @returns {AudioResource | undefined}
   */
  get(id) {
    return this.cache.get(id);
  }

  /**
   * 移除资源
   * @param {string} id
   */
  remove(id) {
    if (this.cache.has(id)) {
      const resource = this.cache.get(id);
      if (resource.audio) {
        resource.audio.src = '';
      }
      this.cache.delete(id);
    }
  }

  /** 清空所有资源 */
  clear() {
    this.cache.forEach(res => {
      if (res.audio) res.audio.src = '';
    });
    this.cache.clear();
  }
}
