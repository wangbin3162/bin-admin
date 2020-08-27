import layout from '../layout'
import sys from './modules/sys'
import dataManage from './modules/data-manage'
import analyzeEngine from './modules/analyze-engine'
import dataAnalyze from './modules/data-analyze'
import excavateAnalyze from './modules/excavate-analyze'
import urp from './modules/urp'
import creditRating from './modules/credit-rating'
import creditService from './modules/credit-service'
import cms from './modules/cms'

/**
 * 开发对应的菜单路由映射
 * @type {*[]}
 */
export const asyncRouterMap = [
  ...sys,
  ...dataManage,
  ...analyzeEngine,
  ...dataAnalyze,
  ...excavateAnalyze,
  ...urp,
  ...creditRating,
  ...creditService,
  ...cms
]

/**
 * @description 创建在 layout 中显示的路由设置
 * @param {Array} routes 动态路由设置
 */
export function createRoutesInLayout(routes = []) {
  return [
    {
      path: '/',
      redirect: { name: 'index' },
      component: layout,
      children: [
        { path: 'index', name: 'index', meta: { title: '首页' }, component: () => import('../pages/Home.vue') },
        // 刷新页面 必须保留
        {
          path: 'refresh',
          name: 'refresh',
          hidden: true,
          component: {
            beforeRouteEnter(to, from, next) {
              next(vm => vm.$router.replace(from.fullPath))
            },
            render: h => h()
          }
        },
        // 页面重定向 必须保留
        {
          path: 'redirect/:route*',
          name: 'redirect',
          hidden: true,
          component: {
            beforeRouteEnter(to, from, next) {
              next(vm => vm.$router.replace(JSON.parse(from.params.route)))
            },
            render: h => h()
          }
        },
        ...routes
      ]
    }
  ]
}

// 新增动态route
export function addRoutes(routes = []) {
  return createRoutesInLayout(routes).concat(routesOutLayout)
}

// 在 layout 之外显示的路由
export const routesOutLayout = [
  // 登录
  { path: '/login', name: 'login', component: () => import('../pages/Login.vue') },
  { path: '/401', component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error401.vue') },
  { path: '/403', component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error403.vue') },
  { path: '/404', component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error404.vue') },
  { path: '/500', component: () => import(/* webpackChunkName: "error" */ '../pages/error/Error500.vue') }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRoutes = createRoutesInLayout().concat(routesOutLayout)
