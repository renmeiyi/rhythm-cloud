<template>
  <q-drawer
    v-model="drawer"
    side="left"
    bordered
    :width="260"
    show-if-above
    behavior="desktop"
  >
    <q-tabs vertical no-indicator bordered>
      <q-item-label header class="labelName" @click="$router.push({ name: 'recommend' })">
        Rhythm Cloud
      </q-item-label>

      <q-route-tab label="🏠 为我推荐" :to="{ name: 'recommend' }" exact />
      <q-route-tab label="🎵 发现音乐" :to="{ name: 'discover' }" exact />
      <q-route-tab label="📡 博客电台" :to="{ name: 'blogRadio' }" exact />

      <q-separator spaced />

      <q-route-tab label="❤ 我喜欢的音乐" :to="{ name: 'liked' }" exact />
      <q-route-tab label="⭐ 我的收藏" :to="{ name: 'favorites' }" exact />
      <q-route-tab label="🔻 下载管理" :to="{ name: 'downloads' }" exact />
      <q-route-tab label="📂 本地歌曲" :to="{ name: 'local' }" exact />
      <q-route-tab label="🕔 最近播放" :to="{ name: 'recent' }" exact />
    </q-tabs>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'

/* ===== v-model props ===== */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

/* ===== v-model 中转 ===== */
const drawer = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})
</script>

