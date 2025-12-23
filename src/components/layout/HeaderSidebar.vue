<template>
  <q-header elevated height-hint="98" class="app-header">
    <q-toolbar class="toolbar-plain" style="background-color: #f8f8f8;">

      <div style="width: 24px;"></div>

      <!-- 搜索 -->
      <div
        class="search-wrapper"
        @focusin="onSearchFocus"
        @focusout="searchFocus = false"
      >
        <q-input
          v-model="keyword"
          dense
          outlined
          placeholder="搜索"
          class="search-input"
          @keyup.enter="onSearch"
          ref="searchInputRef"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- 搜索面板 -->
        <div class="search-panel" v-if="searchFocus">
          <template v-if="historyList.length">
            <div class="search-item title">最近搜索</div>
            <div
              class="search-item"
              v-for="item in historyList"
              :key="item"
              @mousedown.prevent="selectKeyword(item)"
            >
              {{ item }}
            </div>
          </template>

          <template v-if="hotList.length">
            <div class="search-item title">🔥 热门搜索</div>
            <div
              class="search-item hot"
              v-for="item in hotList"
              :key="item.word"
              @mousedown.prevent="selectKeyword(item)"
            >
              {{ item.word }}
            </div>
          </template>
        </div>
      </div>

      <q-space />
      <q-avatar />

    </q-toolbar>
  </q-header>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../../stores/search'

const router = useRouter()
const searchStore = useSearchStore()
const { historyList, hotList } = storeToRefs(searchStore)

const keyword = ref('')
const searchFocus = ref(false)
const searchInputRef = ref(null)

function onSearchFocus () {
  searchFocus.value = true
  searchStore.loadHistory()
  if (!searchStore.hotList.length) {
    searchStore.getHotSearch()
  }
}

function onSearch () {
  if (!keyword.value) return
  doSearch(keyword.value)
}

function doSearch (word) {
  keyword.value = word
  searchStore.saveHistory(word)
  searchFocus.value = false
  searchInputRef.value.blur()

  router.push({
    path: '/search',
    query: { keyword: word }
  })
}

function selectKeyword (item) {
  const word = typeof item === 'string' ? item : item.word
  doSearch(word)
}
</script>
