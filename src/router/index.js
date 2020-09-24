import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import BinUI from 'bin-ui'
import util from '@/common/utils/util'
import { ACCESS_TOKEN } from '@/common/token-const'
// 路由数据
import { addRoutes, constantRoutes } from '@/router/routes'
import { getMenus } from '@/common/config/menuList'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

/**
 * @description 创建路由
 * @param {Array} routes 路由设置
 */
const createRouter = (routes = []) => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

// 导出路由 在 main.js 里使用
const router = createRouter(constantRoutes)

/**
 * @description 重新设置路由
 * @param {Array} routes 额外追加的路由
 */
export function resetRouter(routes = []) {
  router.matcher = createRouter(routes).matcher
}

// 权限白名单 no redirect whitelist
const whiteList = ['/login', '/404', '/401', '/403', '/500']

router.beforeEach(async (to, from, next) => {
  BinUI.LoadingBar.start()
  const token = util.cookies.get(ACCESS_TOKEN)
  if (token && token !== 'undefined') {
    // 确定用户是否通过getInfo获得了他的权限角色// 这里暂时默认获取了角色
    const userInfo = store.getters.userInfo
    if (userInfo) {
      next()
    } else { // 否则就去拉取用户信息
      try {
        let res = await store.dispatch('getUserInfo')
        let menus = getMenus(res.data.data.functions || [])
        // console.log('menus: ', menus)
        let { menuItems } = await store.dispatch('setRouterMenu', menus)
        let asyncRoute = await store.dispatch('generateRoutes', menuItems)
        // console.log('asyncRoute: ', asyncRoute)
        // [ 路由 ] 计算路由
        const routes = addRoutes(asyncRoute)
        // [ 路由 ] 重新设置路由
        resetRouter(routes)
        router.addRoutes([{ path: '*', redirect: '/404' }])

        next({ ...to, replace: true })
      } catch (e) {
        next({ name: 'login', query: { redirect: to.fullPath } })
      }
    }
  } else {
    // 没有登录的时候跳转到登录界面 // 携带上登陆成功之后需要跳转的页面完整路径
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登陆白名单中
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }
})
router.afterEach(() => {
  BinUI.LoadingBar.done()
})
export default router
