/**
 * PlayerController
 * --------------------------------
 * 播放器核心控制器（业务中枢）
 *
 * 职责：
 * - 协调 AudioEngine 与播放逻辑
 * - 实现播放 / 暂停 / 切歌等业务规则
 * - 管理播放状态机
 * - 触发语义化播放器事件
 */
export default class PlayerController {
    //依赖注入，外界提供audioEngine
    constructor(audioEngine,options = {}){
        //保存依赖
        this.engine = audioEngine;
        //初始化状态,不播放，没有歌显示
        this.playing = false;
        this._currentSong = null;
        //解析options配置
        this.onPlay = options.onPlay || (() => {});
        this.onPause = options.onPause || (() => {});
        this.onEnded = options.onEnded || (() => {});
        this.onTimeUpdate = options.onTimeUpdate || (() => {});
        this.onError = options.onError || (() => {});
        //绑定事件,this指向PlayerController
        this._handleEnded = this._handleEnded.bind(this);
        this._handleTimeUpdate = this._handleTimeUpdate.bind(this);
        this._handleError = this._handleError.bind(this);
        //监听事件
        this.engine.on('ended',this._handleEnded);
        this.engine.on('timeupdate',this._handleTimeUpdate);
        this.engine.on('error',this._handleError);
    }
        /**对外的API */
        // 1、播放/切歌
        async play(song){ 
            try{ 
                if(song && song !== this._currentSong){
                    this._currentSong = song;
                    this.engine.load(song.url)
                }
                await this.engine.play();
                this.playing = true;
                this.onPlay(this._currentSong);
            }catch(e){
                this.playing = false; 
                this.onError(e);
            }
        }
        // 2、暂停
        pause(){
            this.engine.pause();
            this.playing = false;
            this.onPause();
        }
        // 3、播放/暂停切换
        toggle(song){
            if(this.playing){
                this.pause();
            }else{
                this.play(song||this._currentSong);
            } 
        }
        // 4、跳转到指定时间
        seek(time){ 
            this.engine.seek(time);
        }
        // 5、设置音量
        setVolume(volume){ 
            this.engine.setVolume(volume);
        }
        // 6、快进
        forward(time){ 
            const target = Math.min(this.duration, this.currentTime + time)
            this.seek(this.currentTime + time);
        }
        // 7、快退
        backward(time){ 
            const target = Math.max(0, this.currentTime - time);
            this.seek(target);
        }
        // 8、停止并回到0
        stop(){ 
            this.engine.pause();
            this.playing = false;
            this.engine.seek(0);
        }
        // 9、销毁播放器
        destroy(){ 
            this.engine.off('ended', this._handleEnded)
            this.engine.off('timeupdate', this._handleTimeUpdate)
            this.engine.off('error', this._handleError)

            this.engine.destroy();
        }
        // 10、设置倍速
        setRate(rate){ 
            this.engine.setRate(rate);
        }
        /**Getters类 */
        // 1、是否正在播放
        get isPlaying(){ 
            return this.playing;
        }
        // 2、当前歌曲
        get currentSong(){ 
            return this._currentSong;
        }
        // 3、当前播放时间
        get currentTime(){ 
            return this.engine.currentTime;
        }
        // 4、总时长
        get duration(){ 
            return this.engine.duration;
        }
        // 5、播放进度(0-1)
        get progress(){ 
            return this.duration ? this.currentTime / this.duration : 0
        }
        // 6、当前倍速
        get rate(){ 
            return this.engine.playbackRate;
        }
        // 7、当前音量
        get volume(){ 
            return this.engine.volume;
        }
        /**Event事件 */
        // 1、播放结束   
        _handleEnded(){ 
            this.playing = false;
            this.onEnded();
        }
        // 2、播放进度更新
        _handleTimeUpdate(){ 
            this.onTimeUpdate(this.currentTime);
        }
        // 3、播放错误
        _handleError(e){ 
            this.playing = false;
            this.onError(e);
        }
}