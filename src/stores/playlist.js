// src/stores/playlist.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getSongDetail, getLyric, getSongURL } from '../api/song.js'

export const usePlayListStore = defineStore('playlist', () => {
  const PLAYLIST_KEY = 'play_list_cache'

  /* ===== state ===== */
  const list = ref([])
  const currentIndex = ref(-1)
  const playing = ref(false)

  // 歌词
  const parsedLyric = ref([])

  /* ===== getters ===== */
  const currentSong = computed(() => list.value[currentIndex.value] || null)
  const hasNext = computed(() => currentIndex.value < list.value.length - 1)
  const hasPrev = computed(() => currentIndex.value > 0)

  /* ===== 本地缓存（不缓存 url） ===== */
  function loadPlayList () {
    const cache = JSON.parse(localStorage.getItem(PLAYLIST_KEY) || '{}')
    list.value = cache.list || []
    currentIndex.value = Number.isInteger(cache.currentIndex)
      ? cache.currentIndex
      : -1
    playing.value = false // 刷新后永远不自动播放
  }

  function savePlayList () {
    localStorage.setItem(
      PLAYLIST_KEY,
      JSON.stringify({
        list: list.value.map(song => {
          const { ...rest } = song
          return rest
        }),
        currentIndex: currentIndex.value,
        playing: playing.value
      })
    )
  }


  /* ===== 歌曲标准化（不拿 URL） ===== */
  async function normalizeSong (raw) {
    const song = { ...raw }

    if (!song.artists || !song.lyric || !song.cover) {
      const [detailRes, lyricRes] = await Promise.all([
        getSongDetail(song.id),
        getLyric(song.id)
      ])

      const detail = detailRes.songs[0]
      song.cover = detail.al.picUrl
      song.artists = detail.ar.map(a => a.name).join(' / ')
      song.lyric = lyricRes.lrc?.lyric || ''
      song.duration = detail.dt / 1000
    }

    return song
  }

  /* ===== 确保 URL 可播放（核心） ===== */
  async function ensurePlayable (song) {
    const now = Date.now()

    if (!song.url || !song.urlExpireAt || now > song.urlExpireAt) {
      const res = await getSongURL(song.id)
      const url = res?.data?.[0]?.url

      if (!url) throw new Error('Song url unavailable')

      song.url = url
      song.urlExpireAt = now + 5 * 60 * 1000 // 5 分钟
    }

    return song.url
  }

  /* ===== 播放控制 ===== */
  async function enqueueAndPlay (rawSong) {
    let index = list.value.findIndex(s => s.id === rawSong.id)

    if (index === -1) {
      const song = await normalizeSong(rawSong)
      list.value.push(song)
      index = list.value.length - 1
    }

    currentIndex.value = index
    playing.value = true
  }

  function playAt (index) {
    if (index >= 0 && index < list.value.length) {
      currentIndex.value = index
      playing.value = true
    }
  }

  function next () {
    if (hasNext.value) {
      currentIndex.value++
      playing.value = true
    }
  }

  function prev () {
    if (hasPrev.value) {
      currentIndex.value--
      playing.value = true
    }
  }

  function toggle () {
    playing.value = !playing.value
  }

  function clear () {
    list.value = []
    currentIndex.value = -1
    playing.value = false
  }

  function remove (song) {
    const index = list.value.findIndex(s => s.id === song.id)
    if (index === -1) return

    list.value.splice(index, 1)

    if (index < currentIndex.value) {
      currentIndex.value--
    } else if (index === currentIndex.value) {
      playing.value = false
    }
  }

  /* ===== 歌词解析 ===== */
  function parseLyric (lyric = '') {
    return lyric
      .split('\n')
      .map(line => {
        const match = line.match(/\[(\d+):(\d+\.?\d*)]/)
        if (!match) return null
        return {
          time: Number(match[1]) * 60 + Number(match[2]),
          text: line.replace(/\[.*?]/g, '').trim()
        }
      })
      .filter(Boolean)
  }

  watch(
    () => currentSong.value?.lyric,
    lyric => {
      parsedLyric.value = lyric ? parseLyric(lyric) : []
    },
    { immediate: true }
  )

  function getCurrentLyricIndex (currentTime = 0) {
    const list = parsedLyric.value
    for (let i = list.length - 1; i >= 0; i--) {
      if (currentTime >= list[i].time) return i
    }
    return 0
  }

  /* ===== 初始化 ===== */
  loadPlayList()

  watch([list, currentIndex], savePlayList, { deep: true })

  return {
    // state
    list,
    currentIndex,
    playing,

    // getters
    currentSong,
    hasNext,
    hasPrev,

    // lyric
    parsedLyric,
    getCurrentLyricIndex,

    // actions
    enqueueAndPlay,
    playAt,
    next,
    prev,
    toggle,
    clear,
    remove,

    // url
    ensurePlayable
  }
})
