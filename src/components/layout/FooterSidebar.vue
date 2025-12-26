<template>
  <!-- 播放器容器 -->
  <div class="player-wrapper">
    <!-- 进度条 -->
    <input
      class="netease-progress floating-progress"
      type="range"
      min="0"
      :max="duration"
      step="0.1"
      :value="displayTime"
      :style="{ '--progress': progressPercent }"
      @input="onProgressInput"
      @change="onProgressChange"
    />
    <q-footer class="player-footer">

      <!-- 控制栏 -->
      <q-toolbar class="under-player">
        <q-avatar size="70px" class="avatar-control" square>
          <img v-if="currentSong?.cover" :src="currentSong.cover" />
          <div v-else class="no-cover">🎵</div>
        </q-avatar>

        <div class="song-info">
          <div class="song-name">{{ currentSong?.name }}</div>
          <div class="song-artist" @click="search(currentSong?.artists)">{{ currentSong?.artists }}</div>
          <div class="lyric-wrapper">
          <div
              class="current-lyric"
              :key="currentLyricIndex"
          >
              {{ parsedLyric[currentLyricIndex]?.text || '♪ ♪ ♪' }}
          </div>
          </div>
        </div>


        <q-btn icon="skip_previous" flat @click="prev" />
        <q-btn
          :icon="playing ? 'pause' : 'play_arrow'"
          flat
          @click="toggle"
        />
        <q-btn icon="skip_next" flat @click="next"/>

        <div class="q-ml-md">
          {{ format(displayTime) }} / {{ format(duration) }}
        </div>

        <q-space />
        <q-btn class="playList-menu" icon="menu" flat @click="$emit('toggle-right-drawer')" />
      </q-toolbar>

    </q-footer>
  </div>
</template>
<script setup>
import { ref, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { usePlayListStore } from '../../stores/playList'
import { useSearchStore } from '../../stores/search'

defineEmits(['toggle-right-drawer'])
const router = useRouter()
const searchStore = useSearchStore()

// 注入播放器实例
const player = inject('player')
// 播放列表
const playListStore = usePlayListStore()
// 当前播放歌曲
const { currentSong } = storeToRefs(playListStore)
const { playing } = storeToRefs(playListStore)

// 进度条
const dragging = ref(false)
const localTime = ref(0)
// 歌词
const { parsedLyric } = storeToRefs(playListStore)

// 进度条时间
const duration = computed(() => player.duration || 0)

// 显示时间
const displayTime = computed(() =>
  dragging.value ? localTime.value : player.currentTime || 0
)

// 进度条百分比
const progressPercent = computed(() => {
  if (!duration.value) return '0%'
  return `${(displayTime.value / duration.value) * 100}%`
})

// 进度条输入
const onProgressInput = (e) => {
  dragging.value = true
  localTime.value = Number(e.target.value)
}

// 拖动中（不 seek）
const onProgressChange = (e) => {
  dragging.value = false
  player.seek(Number(e.target.value))
}

// 时间格式化
const format = (t = 0) => {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

//当前行
const currentLyricIndex = computed(() =>{
    return playListStore.getCurrentLyricIndex(player.currentTime || 0)
})

// 播放暂停
const toggle = () => {
  if (playing.value) {
    player.pause()
  } else {
    player.play(currentSong.value)
  }
}

// 上一曲
const prev = () => {
  playListStore.prev()
}

// 下一曲
const next = () => {
  playListStore.next()
}

function search (word) {
  if (!word) return

  searchStore.saveHistory(word)

  router.push({
    path: '/search',
    query: { keyword: word }
  })
}
</script>
