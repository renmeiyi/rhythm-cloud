<template>
  <q-page padding class="search-page">
    <!-- 标题 -->
    <div class="text-h6 q-mb-md">
      搜索结果：{{ keyword }}
    </div>

    <!-- loading -->
    <div v-if="loading" class="loading-wrap">
      <q-spinner size="32px" />
    </div>

    <!-- empty -->
    <div v-else-if="!resultList.length" class="empty">
      暂无结果
    </div>

    <!-- list -->
    <q-list v-else bordered separator class="song-list">
      <q-item
        v-for="item in resultList"
        :key="item.id"
        clickable
        v-ripple
        class="song-item"
        @click="playSong(item)"
      >
        <!-- 歌名 + 歌手 -->
        <q-item-section>
          <q-item-label class="song-name-search">
            {{ item.name }}
          </q-item-label>
          <q-item-label caption class="song-artist-search">
            {{ item.artists?.map(a => a.name).join(' / ') }}
          </q-item-label>
        </q-item-section>

        <!-- 专辑 -->
        <q-item-section side class="album">
          {{ item.album?.name }}
        </q-item-section>

        <!-- 时长 -->
        <q-item-section side class="duration">
          {{ formatTime(item.duration) }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from 'src/stores/search'
import '../../css/SearchResult.css'
// import { 
//   getSongURL,
//   getSongDetail,
//   getLyric
// } from 'src/api/song'
import { usePlayListStore } from 'src/stores/playlist'

const playListStore = usePlayListStore()
const searchStore = useSearchStore()
const route = useRoute()

const keyword = ref('')
const loading = ref(false)
const resultList = ref([])

watch(
  () => route.query.keyword,
  async (newKeyword) => {
    if (!newKeyword) return

    keyword.value = newKeyword
    loading.value = true

    const res = await searchStore.Search(keyword.value)
    resultList.value = res
    // resultList.value = resultList.value.filter(item => item.fee !== 1 && item.fee !== 4)

    loading.value = false

    console.log('resultList', resultList.value)
  },
  { immediate: true }
)

// function normalizeSong(item,url,cover,lyric) {
//   return {
//     id: item.id,
//     name: item.name,
//     artists: item.artists?.map(a => a.name).join(' / ') || '',
//     cover,
//     duration: item.duration/1000,
//     // url,
//     lyric
//   }
// }

// 格式化时间
function formatTime (ms) {
  const total = Math.floor(ms / 1000)
  const min = Math.floor(total / 60)
  const sec = total % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

async function playSong (item) {
  try {
    await playListStore.enqueueAndPlay(item)
  } catch (e) {
    console.error('播放失败', e)
  }
}
</script>
