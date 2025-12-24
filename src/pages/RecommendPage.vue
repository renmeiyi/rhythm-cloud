<template>
  <q-page class="recommend-page" style="background-color: var(--bg-bottom);">

    <div class="section-highqualityList-discovery">
      <div class="section-header">
        <h5>推荐歌单</h5>
      </div>

      <div class="section-content-topList">
        <div
          v-for="item in topList"
          :key="item.id"
          class="topList-card"
          @click="goPlayList(item)"
        >
          <img class="cover" :src="item.picUrl" />
          <div class="info">
            <div class="name">{{ item.name }}</div>
          </div>
          <div v-if="item.hot" class="hot">🔥 精选</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRecommendPlayList } from '../api/recommend'
import '../css/recommend.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const topList = ref([])

onMounted(async () => { 
  const res = await getRecommendPlayList()
  topList.value = res.result
})

const goPlayList = (item) => {
  const id = item.id
  const imgUrl = item.picUrl
  const description = ''
  const name = item.name
  const tags = ''
  const creatorName = ''

  router.push({
    path: '/PlayList',
    query: { 
      id,
      imgUrl,
      description,
      name,
      tags,
      creatorName
     }
  })
}
</script>
