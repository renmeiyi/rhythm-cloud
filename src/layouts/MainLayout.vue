<template>
  <q-layout view="LHr lpR fFr" class="body">

    <!-- 右侧 drawer 遮罩 -->
    <div
      v-show="rightDrawerOpen"
      class="frost-mask drawer-mask"
      @click="closeRightDrawer"
    />

    <!-- Header -->
     <HeaderSidebar v-model="HeaderOpen" />

    <LeftSidebar v-model="leftDrawerOpen" />
    <!-- 右侧 drawer -->
    <RightSidebar v-model="rightDrawerOpen" />


    <!-- 页面容器 -->
    <q-page-container>
      <router-view/>
    </q-page-container>

    <!-- Footer -->
     <FooterSidebar v-model="FooterOpen" @toggle-right-drawer="rightDrawerOpen=true"/>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import './MainLayout.css'
import LeftSidebar from '../components/layout/LeftSidebar.vue'
import RightSidebar from '../components/layout/RightSidebar.vue'
import HeaderSidebar from '../components/layout/HeaderSidebar.vue'
import FooterSidebar from '../components/layout/FooterSidebar.vue'

/* ===== Layout 状态 ===== */
const rightDrawerOpen = ref(false)
const leftDrawerOpen = ref(true)
const HeaderOpen= ref(true)
const FooterOpen = ref(true)

/* ===== Drawer ===== */
const closeRightDrawer = () => {
  rightDrawerOpen.value = false
}

</script>

