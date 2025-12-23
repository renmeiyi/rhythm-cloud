<template>
  <router-view />

  <!-- 全局唯一 Audio -->
  <audio
    ref="audioRef"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoaded"
    @ended="onEnded"
    @play="onPlay"
    @pause="onPause"
    @error="onError"
  />
</template>

<script setup>
import { ref, reactive, watch, provide, onMounted } from 'vue'
import { usePlayListStore } from 'src/stores/playlist'

const audioRef = ref(null)
const playListStore = usePlayListStore()

/* 🎧 播放器控制器（不直接操作 audio） */
const player = reactive({
  currentTime: 0,
  duration: 0,

  play () {
    if (!playListStore.currentSong) return
    playListStore.playing = true
  },

  pause () {
    playListStore.playing = false
  },

  seek (time) {
    if (audioRef.value) {
      audioRef.value.currentTime = time
    }
  }
})

/* ===== 切歌：唯一设置 src 的地方 ===== */
onMounted(() => {
  playListStore.playing = false

  watch(
    () => playListStore.currentSong,
    async (song) => {
      const audio = audioRef.value
      if (!audio || !song) return

      try {
        const url = await playListStore.ensurePlayable(song)

        audio.pause()
        audio.src = url
        audio.load()
        await audio.play()

      } catch (e) {
        console.error('播放失败', e)
        playListStore.playing = false
      }
    },
    { immediate: true }
  )
})

/* ===== 播放 / 暂停 ===== */
watch(
  () => playListStore.playing,
  (playing) => {
    const audio = audioRef.value
    if (!audio || !audio.src) return
    playing ? audio.play().catch(() => {}) : audio.pause()
  }
)

/* ===== 播放结束 ===== */
const onEnded = () => {
  if (playListStore.hasNext) {
    playListStore.next()
  } else {
    playListStore.playing = false
  }
}

/* ===== 错误重试（URL 失效） ===== */
let retrying = false

const onError = async () => {
  if (retrying) return
  retrying = true

  const audio = audioRef.value
  const song = playListStore.currentSong
  if (!audio || !song) return

  const time = audio.currentTime || 0

  try {
    song.urlExpireAt = 0
    await playListStore.ensurePlayable(song)

    audio.src = song.url
    audio.load()
    audio.currentTime = Math.max(0, time - 0.5)

    if (playListStore.playing) {
      await audio.play()
    }
  } catch (e) {
    console.error('重试失败', e)
    playListStore.playing = false
  } finally {
    retrying = false
  }
}

/* ===== 时间同步 ===== */
const onTimeUpdate = () => {
  player.currentTime = audioRef.value?.currentTime || 0
}

const onLoaded = () => {
  player.duration = audioRef.value?.duration || 0
}

/* ===== 状态回写 ===== */
const onPlay = () => {
  playListStore.playing = true
}

const onPause = () => {
  playListStore.playing = false
}

provide('player', player)
</script>
