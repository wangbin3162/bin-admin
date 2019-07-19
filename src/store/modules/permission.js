import { asyncRouterMap, constantRouterMap } from '../../router/routes'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除,这里暂时通过这种方式获取
 *
 * @param roles
 * @param route
 * @returns {boolean}
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function filterAsyncRoutes (routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: [] // 左侧菜单栏的缓存路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateRoutes ({ commit }, roles) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRoutes(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
