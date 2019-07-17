import layout from '../layout/layout'

/**
 * router自定义配置项
 * hidden: true                   如果设置true则左侧路由菜单隐藏
 * name:'router-name'             <keep-alive>使用必须设置 (must set!!!)
 * meta : {
    title: 'title',                当前路由的中文名称
    icon: 'a-icon',                当前菜单的图标样式，使用阿里iconfont
    keepAlive: true,               页面缓存
    permission: true,              是否有权限
  }
 **/

export const asyncRouterMap = [
  {
    path: '/',
    component: layout,
    redirect: { name: 'index' },
    children: [
      // 首页 必须 name:index
      {
        path: 'index',
        name: 'index',
        meta: { title: '首页', icon: 'icon-ios-home', noCache: true },
        component: () => import('../views/index/index.vue')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: {
          beforeRouteEnter (to, from, next) {
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
          beforeRouteEnter (to, from, next) {
            next(vm => vm.$router.replace(JSON.parse(from.params.route)))
          },
          render: h => h()
        }
      }
    ]
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '../views/error/404.vue')
  }
]

// 重新组织后导出
export default [
  ...asyncRouterMap,
  ...constantRouterMap
]
