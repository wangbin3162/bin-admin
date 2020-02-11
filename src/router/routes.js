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
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // 首页 必须 name:index
  {
    path: '/index',
    name: 'index',
    component: index,
    meta: { title: '首页' }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "list" */ '../views/pages/Detail.vue'),
    meta: { title: '详情' }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import(/* webpackChunkName: "list" */ '../views/pages/Stock.vue'),
    meta: { title: '股权结构图' }
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
