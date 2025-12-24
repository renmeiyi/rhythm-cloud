<template>
  <div class="settings-panel">
    <h3 class="title">主题颜色</h3>

    <div class="item">
      <span>Primary</span>

      <div class="color-control">
        <div
          class="color-preview"
          :style="{ background: primary }"
        />
        <input
          class="color-input"
          type="color"
          v-model="primary"
          @input="applyTheme"
        />
      </div>
    </div>

    <div class="item">
      <span>Accent</span>

      <div class="color-control">
        <div
          class="color-preview"
          :style="{ background: accent }"
        />
        <input
          class="color-input"
          type="color"
          v-model="accent"
          @input="applyTheme"
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref,onMounted } from 'vue'

const primary = ref('#3b82f6')
const accent  = ref('#facc15')

/* ========== 工具函数 ========== */

/* hex -> rgba（自动 soft） */
function hexToRgba(hex, alpha = 0.18) {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* 写入 CSS 变量 */
function setVar(name, value) {
  document.documentElement.style.setProperty(name, value)
}

/* 应用主题 */
function applyTheme() {
  setVar('--primary', primary.value)
  setVar('--primary-soft', hexToRgba(primary.value, 0.14))

  setVar('--accent', accent.value)
  setVar('--accent-soft', hexToRgba(accent.value, 0.18))
}
onMounted(() => {
  applyTheme()
})
</script>

<style lang="scss">
.settings-panel {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
  }

  input[type="color"] {
    width: 42px;
    height: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
  }
}
</style>