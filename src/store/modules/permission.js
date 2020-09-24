import { asyncRouterMap, addRoutes } from '@/router/routes'

/**
 * 根据返回的树形菜单，递归筛选路由节点
 * @param routes
 * @param menuItems 所有平铺的菜单项
 * @returns {[]}
 */
function filterAsyncRoutes(routes, menuItems) {
  const all = []
  menuItems.forEach(menu => {
    let matchIndex = routes.findIndex(item => item.path.toLowerCase() === menu.name.toLowerCase())
    if (matchIndex > -1) {
      all.push(routes[matchIndex])
    }
  })
  return all
}

const permission = {
  state: {
    routes: [],
    addRouters: [] // 左侧菜单栏的缓存路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routes = addRoutes(routers)
    }
  },
  actions: {
    generateRoutes({ commit }, menuItems) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRoutes(asyncRouterMap, menuItems)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
