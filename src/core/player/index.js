/**
 * core/player entry
 * --------------------------------
 * 播放器内核统一出口
 *
 * 职责：
 * - 创建并组合播放器核心模块
 * - 对外暴露标准播放器接口
 *
 * 说明：
 * - UI / composables 只能通过此入口访问播放器
 */
import AudioEngine from "./AudioEngine";
import PlayerController from "./PlayerController";
import PlayerEvents from "./PlayerEvents";

// 创建单例,解耦
const engine = new AudioEngine()
const events = new PlayerEvents()
const player = new PlayerController(engine, {
  onPlay: (song) => events.emit('play', song),
  onPause: () => events.emit('pause'),
  onEnded: () => events.emit('ended'),
  onTimeUpdate: (time) => events.emit('timeupdate', time),
  onError: (e) => events.emit('error', e)
})

export{
    AudioEngine,
    PlayerController,
    PlayerEvents,

    engine,
    events,
    player
}