
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'recommend',
        component: () => import('pages/RecommendPage.vue')
      },
      {
        path: 'discover',
        name: 'discover',
        component: () => import('pages/DiscoverPage.vue')
      },
      {
        path: 'blogRadio',
        name: 'blogRadio',
        component: () => import('pages/BlogRadioPage.vue')
      },
      {
        path: 'downloads',
        name: 'downloads',
        component: () => import('pages/DownLoadsPage.vue')
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('pages/FavoritesPage.vue')
      },
      {
        path: 'liked',
        name: 'liked',
        component: () => import('pages/LikedPage.vue')
      },
      {
        path: 'local',
        name: 'local',
        component: () => import('pages/LocalPage.vue')
      },
      {
        path: 'recent',
        name: 'recent',
        component: () => import('pages/RecentPage.vue')
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('../components/search/SearchResult.vue')
      },
      {
        path: '/PlayList',
        name: 'PlayList',
        component: () => import('../components/recommend/PlayList.vue')
      },
      {
        path: '/CategoryDetail',
        name: 'CategoryDetail',
        component: () => import('../components/recommend/CategoryDetail.vue')
      },
      {
        path: '/ArtistDetail',
        name: 'ArtistDetail',
        component: () => import('../components/recommend/ArtistDetail.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
