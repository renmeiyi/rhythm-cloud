<template>
  <div class="settings-panel">
    <div class="title">设置</div>

    <q-separator />

    <div class="section">
      <div class="item">
        <span>深色模式</span>
        <q-toggle v-model="dark" />
      </div>

      <div class="item">
        <span>自动播放</span>
        <q-toggle v-model="autoPlay" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dark = ref(false)
const autoPlay = ref(true)
</script>

