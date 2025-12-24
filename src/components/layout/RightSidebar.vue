<template>
  <q-drawer v-model="drawer" side="right" bordered overlay :width="400">
    <q-toolbar>
      <div class="text-subtitle1">
        播放列表
      </div>
      <q-space />
      <q-btn flat icon="close" @click="close" />
    </q-toolbar>

    <q-list separator>
      <q-item
        v-for="(item, index) in playList"
        :key="item.id"
        clickable
        v-ripple
        :active="index === currentIndex"
        active-class="bg-grey-3"
        @click="playSong(index)"
      >
        <q-item-section>
          <q-item-label class="song-name-left">
            {{ item.name }}
          </q-item-label>
          <q-item-label caption class="song-artist-left">
            {{ item.artists }}
          </q-item-label>
        </q-item-section>

        <q-btn
          flat
          icon="delete"
          color="negative"
          @click.stop="removeSong(item)"
          class="right-del"
        />
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayListStore } from '../../stores/playList'

/* ===== v-model props ===== */
const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const drawer = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

/* ===== playlist ===== */
const playListStore = usePlayListStore()
const { list: playList, currentIndex } = storeToRefs(playListStore)

function close () {
  drawer.value = false
}

function playSong (index) {
  playListStore.playAt(index)
}

function removeSong (item) {
  playListStore.remove(item)
}
</script>
