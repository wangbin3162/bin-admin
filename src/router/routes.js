import layout from '../layout'
import sys from './modules/sys'
import dataManage from './modules/data-manage'
import dataAnalyze from './modules/data-analyze'
import creditRating from './modules/credit-rating'
import urp from './modules/urp'
import creditService from './modules/credit-service'

/**
 * router自定义配置项
 * hidden: true                   如果设置true则左侧路由菜单隐藏
 * name:'router-name'             <keep-alive>使用必须设置 (must set!!!)
 * meta : {
    roles: false,                  如果设置roles则不需要去验证过滤，直接全部显示为菜单栏
    title: 'title',                当前路由的中文名称
    icon: 'a-icon',                当前菜单的图标样式，使用阿里iconfont
    activeMenu: '/example/list'    如果设置路径，侧栏将突出显示您设置的路径,即默认选择的菜单
  }
 **/
export const asyncRouterMap = [
  sys, dataManage, dataAnalyze, creditRating, urp, creditService,
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: layout,
    redirect: { name: 'index' },
    children: [
      // 首页 必须 name:index
      {
        path: 'index',
        name: 'index',
        meta: { title: '首页', icon: 'icon-ios-home', noCache: false, affix: true },
        component: () => import('../pages/Home.vue')
      },
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
      }
    ]
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue')
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
  ...asyncRouterMap,
  ...constantRouterMap
]
