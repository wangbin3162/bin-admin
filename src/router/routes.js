import layout from '../layout'
import components from './modules/components'
import tableDemo from './modules/table-demo'
import configDemo from './modules/config-demo'
import errorPage from './modules/error-page'
import nested from './modules/nested'

export const asyncRouterMap = [
  ...components,
  ...tableDemo,
  ...configDemo,
  ...nested,
  ...errorPage
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
