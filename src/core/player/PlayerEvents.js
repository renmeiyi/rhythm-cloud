/**
 * PlayerEvents
 * --------------------------------
 * 播放器事件分发中心
 *
 * 职责：
 * - 定义播放器内部事件类型
 * - 提供事件订阅与触发机制
 *
 * 目的：
 * - 解耦 AudioEngine 与 PlayerController
 * - 方便 composables / UI 监听
 */
export default class PlayerEvents { 
    constructor () {
      this._events = new Map()
    }

    /**
     * 订阅事件
     * @param {string} event 事件名
     * @param {function} callback 回调函数
     */
    on (event, callback) {
      if (!this._events.has(event)) {
        this._events.set(event, new Set())
      }
      this._events.get(event).add(callback)
    }
    /**
     * 取消订阅
     */
    off(event, callback) {
        this._events.get(event)?.delete(callback)
    }
    /**
     * 触发事件
     * @param {string} eventName 事件名
     * @param {any} data 数据
     */
    emit(event, payload) {
        this._events.get(event)?.forEach(fn => {
        try {
            fn(payload)
        } catch (e) {
            console.error(`[PlayerEvents] ${event} error`, e)
        }
        })
    }
    /**
     * 移除事件
     */
    clear () {
        this._events.clear()
    }
}