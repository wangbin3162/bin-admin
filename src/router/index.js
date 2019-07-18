import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
// 路由数据
import { constantRouterMap } from './routes'
import BinUI from 'bin-ui'
import util from '../core/utils/util'
import { ACCESS_TOKEN } from '../store/mutation-types'

Vue.use(BinUI)

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: constantRouterMap
})

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
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else { // 否则就去拉取用户信息
        store.dispatch('getUserInfo')
          .then(res => {
            const roles = res.data.result && res.data.result.roles
            store.dispatch('generateRoutes', roles).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
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
      next({ name: 'login', query: { redirect: to.fullPath } })
      BinUI.LoadingBar.done()
    }
  }
})
router.afterEach(() => {
  BinUI.LoadingBar.done()
})

export default router
