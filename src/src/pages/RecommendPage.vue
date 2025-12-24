<template>
  <q-page class="recommend-page" style="background-color: var(--bg-bottom)">

    <div class="section-categoryList">
        <!-- 标题 -->
      <div class="section-header">
        <h5>推荐分类</h5>
        <span class="sub">根据热门分类推荐~</span>
      </div>

      <!-- 内容 -->
      <div class="section-content">
        <div
          v-for="item in categoryList"
          :key="item.id"
          class="categoryList-card"
          @click="goCategoryDetail (item.id)"
        >
          <div class="category">歌单分类</div>
          <div class="name">{{ item.name }}</div>
          <div class="count">使用次数：{{ item.usedCount }}</div>
          <div v-if="item.hot" class="hot">🔥 热门</div>
        </div>
      </div>
    </div>

    <div class="section-highqualityList">
      <div class="section-header">
        <h5>推荐歌单</h5>
        <span class="sub">根据精选 / 精品歌单推荐~</span>
      </div>

      <!-- 左对齐 -->
      <q-tabs
        v-model="playlistTab"
        dense
        class="playlist-tabs"
        active-color="primary"
        indicator-color="primary"
        align="left"
        style="margin-left: 30px;"
      >
        <q-tab name="top" label="精选歌单" />
        <q-tab name="high" label="精品歌单" />
      </q-tabs>

      <q-tab-panels v-model="playlistTab" animated>
        <!-- 精选歌单 -->
        <q-tab-panel name="top">
          <div class="section-content-topList">
            <div
              v-for="item in topList"
              :key="item.id"
              class="topList-card"
              @click="goPlayList(item)"
            >
              <img class="cover" :src="item.coverImgUrl" />
              <div class="info">
                <div class="name">{{ item.name }}</div>
                <div class="desc">{{ item.description || '暂无简介' }}</div>
              </div>
              <div v-if="item.hot" class="hot">🔥 精选</div>
            </div>
          </div>
        </q-tab-panel>

        <!-- 精品歌单 -->
        <q-tab-panel name="high">
          <div class="section-content-highqualityList">
            <div
              v-for="item in highqualityList"
              :key="item.id"
              class="highqualityList-card"
              @click="goPlayList(item)"
            >
              <img class="cover" :src="item.coverImgUrl" />
              <div class="info">
                <div class="name">{{ item.name }}</div>
                <div class="desc">{{ item.description || '暂无简介' }}</div>
              </div>
              <div v-if="item.hot" class="hot">🔥 精品</div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>


    <div class="section-artistList">
      <div class="section-header">
        <h5>推荐歌手</h5>
        <span class="sub">根据热门分类推荐~</span>
      </div>
      <div class="section-content-artistList">
        <div
          v-for="item in artistList"
          :key="item.id"
          class="artistList-card"
          @click="goArtistDetail (item.id)"
        >
          <img class="cover" :src="item.img1v1Url" />

          <div class="info">
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHotPlayList,getHighquality,getArtistList,getTop } from '../api/recommend'
import '../css/recommend.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const categoryList = ref([])
const highqualityList = ref([])
const artistList = ref([])
const topList = ref([])

const playlistTab = ref('top')

onMounted(async () => {
  const res = await getHotPlayList()
  categoryList.value = res.tags
})
onMounted(async () => {
  const res = await getHighquality()
  highqualityList.value = res.playlists
})

onMounted(async () => {
  const res = await getArtistList()
  artistList.value = res.artists
})

onMounted(async () => {
  const res = await getTop()
  console.log("res",res)
  topList.value = res.playlists
})

const goPlayList = (item) => {
  console.log("item",item)
  const id = item.id
  const imgUrl = item.coverImgUrl
  const description = item.description
  const name = item.name
  const tags = item.tags
  const creatorName = item.creator.nickname

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

const goCategoryDetail = (id) => {
  console.log("id",id)

  router.push({
    path: '/CategoryDetail',
    query: { id }
  })
}

const goArtistDetail = (id) => {
  console.log("id",id)

  router.push({
    path: '/ArtistDetail',
    query: { id }
  })
}
</script>
