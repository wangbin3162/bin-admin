import index from '../pages/index.vue'

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
    meta: { title: '首页' }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "list" */ '../pages/Detail.vue'),
    meta: { title: '详情' }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import(/* webpackChunkName: "list" */ '../pages/Stock.vue'),
    meta: { title: '股权结构图' }
  },
  {
    path: '/urp/index',
    name: 'UrpIndex',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/UrpIndex'),
    meta: { title: '联合奖惩首页' }
  },
  {
    path: '/urp/feedback',
    name: 'Feedback',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/Feedback'),
    meta: { title: '执行记录' }
  },
  {
    path: '/urp/memoList',
    name: 'MemoList',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/MemoList'),
    meta: { title: '联合奖惩备忘录' }
  },
  {
    path: '/urp/memoDetail',
    name: 'MemoDetail',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/MemoDetail'),
    meta: { title: '联合奖惩备忘录详情' }
  },
  {
    path: '/urp/listResult',
    name: 'ListResult',
    component: () => import(/* webpackChunkName: "urp" */ '../pages/urp/ListResult'),
    meta: { title: '联合奖惩执行记录' }
  },
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
