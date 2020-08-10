import index from '../pages/index.vue'
import urp from './urp'
import cms from './cms'
import excavate from './excavate'
import collectAnalysis from './collect-analysis'

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
    component: () => import('../pages/Login.vue')
  },
  // 首页 必须 name:index
  {
    path: '/index',
    name: 'index',
    component: index,
    meta: { title: '公共信用信息共享平台' }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "list" */ '../pages/Detail.vue'),
    meta: { title: '公共信用信息共享平台' }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import(/* webpackChunkName: "list" */ '../pages/Stock.vue'),
    meta: { title: '股权结构图' }
  },
  ...urp,
  ...cms,
  ...excavate,
  ...collectAnalysis,
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error401.vue')
  },
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error403.vue')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error404.vue')
  },
  {
    path: '/500',
    component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error500.vue')
  }
]

// 重新组织后导出
export default [
  ...constantRouterMap
]
