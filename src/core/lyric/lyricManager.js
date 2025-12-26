/**
 * 歌词行对象
 * @typedef {Object} LyricLine
 * @property {number} time - 时间戳（秒）
 * @property {string} text - 歌词文本
 */

/**
 * 歌词管理类
 */
export class LyricManager {
  constructor() {
    this.lyrics = [];            // LyricLine 数组
    this.currentLineIndex = 0;   // 当前显示行
    this.lineChangeCallbacks = []; // 外部回调
  }

  /**
   * 解析 LRC 歌词文本
   * @param {string} lrcText
   */
  load(lrcText) {
    this.lyrics = [];
    const lines = lrcText.split(/\r?\n/);
    const timeReg = /\[(\d+):(\d+(\.\d+)?)\]/;

    lines.forEach((line) => {
      const match = line.match(timeReg);
      if (match) {
        const min = parseInt(match[1], 10);
        const sec = parseFloat(match[2]);
        const text = line.replace(timeReg, '').trim();
        this.lyrics.push({
          time: min * 60 + sec,
          text: text
        });
      }
    });

    // 按时间排序
    this.lyrics.sort((a, b) => a.time - b.time);
    this.currentLineIndex = 0;
  }

  /**
   * 根据播放时间获取当前歌词行
   * @param {number} currentTime 播放进度（秒）
   * @returns {LyricLine|null}
   */
  getCurrentLine(currentTime) {
    if (!this.lyrics.length) return null;

    // 当前行可能已经过了时间
    while (
      this.currentLineIndex < this.lyrics.length - 1 &&
      currentTime >= this.lyrics[this.currentLineIndex + 1].time
    ) {
      this.currentLineIndex++;
      this._triggerLineChange(this.lyrics[this.currentLineIndex]);
    }

    // 处理回退情况
    while (
      this.currentLineIndex > 0 &&
      currentTime < this.lyrics[this.currentLineIndex].time
    ) {
      this.currentLineIndex--;
      this._triggerLineChange(this.lyrics[this.currentLineIndex]);
    }

    return this.lyrics[this.currentLineIndex];
  }

  /**
   * 注册歌词行变化回调
   * @param {(line: LyricLine) => void} callback
   */
  onLineChange(callback) {
    if (typeof callback === 'function') {
      this.lineChangeCallbacks.push(callback);
    }
  }

  /** 触发行变化事件 */
  _triggerLineChange(line) {
    this.lineChangeCallbacks.forEach((cb) => cb(line));
  }

  /** 重置歌词播放 */
  reset() {
    this.currentLineIndex = 0;
  }
}
