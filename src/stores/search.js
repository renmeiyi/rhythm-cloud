import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getSearch,
    getSearchDefault,
    // getSearchSuggest,
    // getSearchHot,
    getSearchHotDetail,
    // getSearchMultimatch
} from '../api/search'

export const useSearchStore = defineStore('search', () => {

  /* ================= state ================= */
  const historyList = ref([])
  const hotList = ref([])
  const defaultKeyword = ref('')

  /* ================= 常量 ================= */
  const HISTORY_KEY = 'search_history'
  const HISTORY_LIMIT = 5

  const HOT_KEY = 'hot_search_cache'
  const HOT_EXPIRE = 1000 * 60 * 60 // 1小时

  /* ================= 历史搜索 ================= */
  function loadHistory () {
    historyList.value = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || '[]'
    )
    // historyList.value = list.slice(0, HISTORY_LIMIT)
  }

  function saveHistory (word) {
    if (!word) return

    let list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    list = list.filter(item => item !== word)
    list.unshift(word)
    list = list.slice(0, HISTORY_LIMIT)

    localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
    historyList.value = list
  }

  /* ================= 热门搜索 ================= */
  async function getHotSearch () {
    const cache = JSON.parse(localStorage.getItem(HOT_KEY) || '{}')
    const now = Date.now()

    // 命中缓存
    if (cache.data && now - cache.time < HOT_EXPIRE) {
      hotList.value = cache.data
      return
    }

    const res = await getSearchHotDetail()

    console.log('🔥 获取热门搜索', res.data)

    // 根据接口结构取值（网易云：res.data.data）
    const list = (res.data || []).map(item => ({
        word: item.searchWord,
        score: item.score,
        iconType: item.iconType,
        content: item.content
    }))

    hotList.value = list

    localStorage.setItem(
      HOT_KEY,
      JSON.stringify({
        data: list,
        time: now
      })
    )
  }

  /* ================= 默认搜索词 ================= */
  async function getDefaultKeyword () {
    const res = await getSearchDefault()
    console.log("默认搜索词",res)
    defaultKeyword.value = res.data.data.showKeyword
  }

  /* ================= 搜索 ================= */
  async function Search (keywords) {
    const res = await getSearch(keywords)
    return res.result.songs
  }

  return {
    historyList,
    hotList,
    defaultKeyword,

    loadHistory,
    saveHistory,
    getHotSearch,
    getDefaultKeyword,
    Search,
  }
})
