import index from '../views/index/index.vue'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: index,
    redirect: { name: 'index' }
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue')
  },
  // 首页 必须 name:index
  {
    path: '/index',
    name: 'index',
    component: index,
    meta: { title: '首页' }
  },
  {
    path: '/list',
    name: 'list',
    component: () => import(/* webpackChunkName: "list" */ '../views/pages/list.vue'),
    meta: { title: '列表页面' }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "error" */ '../views/error/401.vue')
  },
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "error" */ '../views/error/403.vue')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "error" */ '../views/error/404.vue')
  },
  {
    path: '/500',
    component: () => import(/* webpackChunkName: "error" */ '../views/error/500.vue')
  }
]

// 重新组织后导出
export default [
  ...constantRouterMap
]
