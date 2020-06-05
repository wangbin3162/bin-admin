import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
// 路由数据
import { constantRouterMap } from './routes'
import BinUI from 'bin-ui'
import util from '../common/utils/util'
import { ACCESS_TOKEN } from '../common/token-const'

Vue.use(BinUI)

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 权限白名单 no redirect whitelist
const whiteList = ['/login', '/404', '/401', '/403', '/500']

router.beforeEach((to, from, next) => {
  BinUI.LoadingBar.start()
  // 这里暂时将cookie里是否存有token作为验证是否登录的条件
  // 请根据自身业务需要修改
  const token = util.cookies.get(ACCESS_TOKEN)
  // 是否有token
  if (token && token !== 'undefined') {
    // token存在则判断一下是否是登录页面
    if (to.path === '/login') {
      // 如果登录过了则直接跳转到目标页面
      next({ path: '/' })
      BinUI.LoadingBar.done()
    } else {
      // 确定用户是否通过getInfo获得了他的权限角色// 这里暂时默认获取了角色
      const userInfo = store.getters.userInfo
      if (userInfo) {
        next()
      } else { // 否则就去拉取用户信息
        store.dispatch('getUserInfo')
          .then(res => {
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            next({ path: redirect, query: to.query })
          })
          .catch(err => {
            util.log.danger(err.message)
            // 无效token则登出并重定向到登录页面
            store.dispatch('logout').then(() => {
              next({ name: 'Login', query: { redirect: to.fullPath } })
              BinUI.LoadingBar.done()
            })
          })
      }
    }
  } else {
    // 没有登录的时候跳转到登录界面
    // 携带上登陆成功之后需要跳转的页面完整路径
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登陆白名单中
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next({ name: 'Login', query: { redirect: to.fullPath } })
      BinUI.LoadingBar.done()
    }
  }
})
router.afterEach(() => {
  BinUI.LoadingBar.done()
})
export default router
