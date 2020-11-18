import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'  // 重定向
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import(/* webpackChunkName: "recommend" */ 'components/recommend/index')
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import(/* webpackChunkName: "rank" */ 'components/rank/index')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ 'components/search/index')
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import(/* webpackChunkName: "singer" */ 'components/singer/index'),
    children: [{
      path: ':id',
      name: 'singer-detail',
      component: () => import(/* webpackChunkName: "singer-detail" */ 'components/singer-detail/index'),
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
