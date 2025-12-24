<template>
  <q-page class="playlist-page">

    <!-- 固定头部 -->
    <div class="playlist-header sticky-header">
      <div class="cover-wrapper">
        <img :src="listUrl" alt="歌单封面" class="cover-img"/>
      </div>

      <div class="info">
        <div class="title">{{ name }}</div>
        <div class="tags">{{ tags }}</div>
        <div class="description">{{ description }}</div>
        <div class="creator">by {{ creatorName }}</div>
      </div>
    </div>

    <!-- 列表容器，可滚动 -->
    <div class="song-list-wrapper">
      <q-list bordered separator class="song-list">

        <!-- 表头 -->
        <q-item class="song-item header">
          <q-item-section side class="index">#</q-item-section>
          <q-item-section>歌曲信息</q-item-section>
        </q-item>

        <!-- 列表 -->
        <q-item
          v-for="(item, index) in playList"
          :key="item.id"
          clickable
          v-ripple
          class="song-item"
          @click="playSong(item)"
        >
          <q-item-section side class="index">
            {{ index + 1 }}
          </q-item-section>

          <q-item-section>
            <q-item-label class="song-name-quality">
              {{ item.name }}
            </q-item-label>
            <q-item-label caption class="song-artist">
              {{ item.artists?.map(a => a.name).join(' / ') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  import { ref,computed,onMounted } from 'vue'
  import { getPlaylist } from '../../api/playlist'
  import { usePlayListStore } from '../../stores/playlist'
  import '../../css/playlist.css'

  const playList = ref([])
  const playListStore = usePlayListStore()
  const listUrl = ref('')
  const name = ref('')
  const tags = ref([])
  const creatorName = ref('')
  const description = ref('')

  onMounted(() => {
    const route = useRoute()
    const id = computed(() => route.query.id)
    const url = computed(() => route.query.imgUrl)
    const listName = computed(() => route.query.name)
    const listTags = computed(() => route.query.tags)
    const listDescription = computed(() => route.query.description)
    listUrl.value = url.value
    name.value = listName.value
    tags.value = listTags.value
    creatorName.value = route.query.creatorName
    description.value = listDescription.value

    console.log('id', description.value)

    getListplay(id.value)
  })

  async function getListplay (id) {
    const res = await getPlaylist(id)
    playList.value = res.playlist.tracks
    playList.value = playList.value.filter(item => item.fee !== 1 && item.fee !== 4)
  }

  async function playSong (item) {
  try {
    await playListStore.enqueueAndPlay(item)
  } catch (e) {
    console.error('播放失败', e)
  }
}
</script>

