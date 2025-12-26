// 播放模式常量
export const PLAY_MODE = {
  SEQUENCE: 'sequence', // 顺序播放
  LOOP: 'loop',         // 单曲循环
  RANDOM: 'random'      // 随机播放
};

/**
 * 播放列表管理类
 */
export class PlaylistManager {
  constructor(tracks = []) {
    this.tracks = tracks;          // 歌曲数组 [{id, title, url, ...}]
    this.currentIndex = 0;         // 当前播放索引
    this.playMode = PLAY_MODE.SEQUENCE; // 默认顺序播放
  }

  /** 添加歌曲到播放列表 */
  add(track) {
    this.tracks.push(track);
  }

  /** 批量添加歌曲 */
  addList(trackList) {
    this.tracks = this.tracks.concat(trackList);
  }

  /** 删除指定索引歌曲 */
  remove(index) {
    if (index < 0 || index >= this.tracks.length) return;
    this.tracks.splice(index, 1);
    if (this.currentIndex >= this.tracks.length) {
      this.currentIndex = this.tracks.length - 1;
    }
  }

  /** 清空播放列表 */
  clear() {
    this.tracks = [];
    this.currentIndex = 0;
  }

  /** 获取当前播放歌曲 */
  getCurrent() {
    return this.tracks[this.currentIndex] || null;
  }

  /** 切换到下一首 */
  next() {
    if (this.tracks.length === 0) return null;

    switch (this.playMode) {
      case PLAY_MODE.SEQUENCE:
        this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
        break;
      case PLAY_MODE.LOOP:
        // 当前索引不变
        break;
      case PLAY_MODE.RANDOM:
        this.currentIndex = Math.floor(Math.random() * this.tracks.length);
        break;
    }
    return this.getCurrent();
  }

  /** 切换到上一首 */
  prev() {
    if (this.tracks.length === 0) return null;

    switch (this.playMode) {
      case PLAY_MODE.SEQUENCE:
        this.currentIndex =
          (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
        break;
      case PLAY_MODE.LOOP:
        // 当前索引不变
        break;
      case PLAY_MODE.RANDOM:
        this.currentIndex = Math.floor(Math.random() * this.tracks.length);
        break;
    }
    return this.getCurrent();
  }

  /** 设置播放模式 */
  setMode(mode) {
    if (Object.values(PLAY_MODE).includes(mode)) {
      this.playMode = mode;
    }
  }

  /** 跳转到指定索引 */
  jumpTo(index) {
    if (index >= 0 && index < this.tracks.length) {
      this.currentIndex = index;
    }
  }

  /** 获取整个播放列表 */
  getList() {
    return this.tracks;
  }
}
