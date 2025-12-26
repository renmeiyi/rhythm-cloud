import { PlaylistManager, PLAY_MODE } from '../playlist/index.js';
import { LyricManager } from '../lyric/index.js';
import { ResourceManager } from '../resource/index.js';
import engine from '../player/index.js';   // 假设 engine 是 AudioEngine 实例
import events from '../player/index.js';   // 假设 events 是事件管理器
import player from '../player/index.js';   // 假设 player 是核心控制对象

class PlayerController {
  constructor() {
    this.playlist = new PlaylistManager();
    this.lyric = new LyricManager();
    this.resourceManager = new ResourceManager();
    this.engine = engine; // AudioEngine
    this.events = events; // 播放事件
  }

  /** 播放当前歌曲 */
  async playCurrent() {
    const track = this.playlist.getCurrent();
    if (!track) return;
    
    // 停止当前播放
    if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
    }

    // 获取资源
    const resource = await this.resourceManager.load(track.id, track.url);

    console.log('resource',this.resourceManager.cache)
    // 播放音频
    this.engine.play(resource.url);

    // 加载歌词
    if (track.lyricText) {
      this.lyric.load(track.lyricText);
      this.lyric.onLineChange((line) => {
        this.events.emit('lyricChange', line);
      });
    }

    this.events.emit('trackChange', track);
  }

  /** 播放下一首 */
  async next() {
    this.playlist.next();
    await this.playCurrent();
  }

  /** 播放上一首 */
  async prev() {
    this.playlist.prev();
    await this.playCurrent();
  }

  /** 播放列表模式设置 */
  setMode(mode) {
    this.playlist.setMode(mode);
  }

  /** 添加歌曲到列表 */
  addTrack(track) {
    this.playlist.add(track);
  }

  /** 暂停 */
  pause() {
    this.engine.pause();
  }

  /** 恢复播放 */
  resume() {
    this.engine.resume();
  }

  /** 获取当前播放曲目 */
  getCurrentTrack() {
    return this.playlist.getCurrent();
  }
}

// 单例导出
const playerController = new PlayerController();
export default playerController;
