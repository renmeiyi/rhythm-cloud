/**
 * AudioEngine
 * --------------------------------
 * 播放器底层音频封装
 *
 * 职责：
 * - 封装 HTMLAudioElement / Electron 音频接口
 * - 提供统一的播放控制 API
 * - 透传音频原生事件
 */
export default class AudioEngine{
    // 创建一个原生HTMLAudioElement，所有音频操作都围绕这个实例进行
    constructor(){
        this.audio = new Audio()
    }
    // 设置音源资源地址
    //强制浏览器重新加载音频，确保切歌时立即触发
    load(src){
        this.audio.src = src
        this.audio.load()
    }
    //请求开始播放音频,返回是否失败，交给playercontroller处理
    play(){
        return this.audio.play()
    }
    //暂停播放，保留currentTime
    pause(){
        this.audio.pause()
    }
    //跳转到指定时间点
    seek(time){
        this.audio.currentTime = time
    }
    //设置音量
    setVolume(volume){
        this.audio.volume = volume
    }
    //设置播放速度
    setRate(rate){
        this.audio.playbackRate  = rate
    }
    
    //彻底释放音频资源，停止下载，断开引用
    destroy(){
        this.pause()
        this.audio.src = ''
        this.audio.load()
    }

    //on event触发
    on(event,handler){
        this.audio.addEventListener(event,handler)
    }

    //off event移除
    off(event,handler){
        this.audio.removeEventListener(event,handler)
    }

    get src() {
        return this.audio.src
    }

    //读取当前的播放时间
    get currentTime() {
        return this.audio.currentTime || 0
    }

    //获取音频总时长
    get duration() {
        return this.audio.duration || 0
    }

    //判断当前是否暂停
    get paused() {
        return this.audio.paused
    }

    //判断音频是否播放结束
    get ended() {
        return this.audio.ended
    }

    get volume() {
        return this.audio.volume
    }

    get playbackRate() {
        return this.audio.playbackRate
    }

    get readyState() {
        return this.audio.readyState
    }
}