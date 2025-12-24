<template>
  <q-header elevated height-hint="98" class="app-header">
    <Teleport to="body">
      <div v-if="searchFocus" class="search-mask" @click="closeSearch" />
      <div
        v-if="searchFocus"
        class="search-floating"
        :class="{ focused: searchFocus }"
        :style="searchFloatingStyle"
      >
        <q-input
          v-model="keyword"
          dense
          outlined
          autofocus
          class="search-input"
          @keyup.enter="onSearch"
          ref="searchInputRef"
        />

        <div class="search-panel">
          <template v-if="historyList.length">
            <div class="search-item title">最近搜索</div>
            <div
              class="search-item"
              v-for="item in historyList"
              :key="item"
              @mousedown.prevent="doSearch(item)"
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
              @mousedown.prevent="doSearch(item.word)"
            >
              {{ item.word }}
            </div>
          </template>
        </div>
      </div>
    </Teleport>
    
    <q-toolbar class="toolbar-plain">

      <div style="width: 24px;"></div>
      <div ref="searchPlaceholderRef" class="search-placeholder" @click="onSearchFocus">
        <q-input
          dense
          outlined
          placeholder="搜索"
          class="search-input"
          readonly
        />
      </div>
      <q-space />
      <!-- 右上角三个图标 -->
      <div class="header-icons">
        <!-- 齿轮icon -->
        <q-btn flat icon="settings" class="settings" @click="showSettings = true" />
        <q-btn flat icon="remove" class="min" @click="onMin" />
        <q-btn flat icon="fullscreen_exit" class="max" @click="onMax" />
        <q-btn flat icon="close" class="close" @click="onClose" />
      </div>
    </q-toolbar>

    <!-- 设置弹窗 -->
    <q-dialog
      v-model="showSettings"
      persistent
      transition-show="scale"
      transition-hide="scale"
      @focusout="showSettings = false"
    >
      <SettingsPanel />
    </q-dialog>
  </q-header>
</template>
<script setup>
import { ref,onMounted,nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import SettingsPanel from './SettingsPanel.vue'
import { useSearchStore } from '../../stores/search'

const router = useRouter()
const searchStore = useSearchStore()
const { historyList, hotList } = storeToRefs(searchStore)

const keyword = ref('')
const searchFocus = ref(false)
const searchInputRef = ref(null)

const showSettings = ref(false)

function closeSearch () {
  searchFocus.value = false
  keyword.value = ''
  searchFloatingStyle.value.width = '180px'
}

const searchPlaceholderRef = ref(null)
const searchFloatingStyle = ref({})

function onSearchFocus () {
  searchFocus.value = true
  searchStore.loadHistory()
  if (!hotList.value.length) {
    searchStore.getHotSearch()
  }
  nextTick(() => {
    const rect = searchPlaceholderRef.value.getBoundingClientRect()
    searchFloatingStyle.value = {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: searchFocus.value ? '320px' : `${rect.width}px`
    }
  })
}

onMounted(() => {
  console.log('window.api', window.api)
})


// function onSearchFocus () {
//   searchFocus.value = true
//   searchStore.loadHistory()
//   if (!searchStore.hotList.length) {
//     searchStore.getHotSearch()
//   }
// }

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
  keyword.value = ''
}

// function selectKeyword (item) {
//   const word = typeof item === 'string' ? item : item.word
//   doSearch(word)
// }

function onMin() { window.api?.min?.() }
function onMax() { window.api?.max?.() }
function onClose() { window.api?.close?.() }

</script>
<style>

</style>