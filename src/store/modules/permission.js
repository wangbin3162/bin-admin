import { asyncRouterMap, addRoutes } from '@/router/routes'

/**
 * 根据返回的树形菜单，递归筛选路由节点
 * @param routes
 * @param functions
 * @returns {[]}
 */
function filterAsyncRoutes(routes, functions) {
  let menus = getAsyncRouter(functions)
  const all = []
  menus.forEach(menu => {
    let matchIndex = routes.findIndex(item => item.name === menu.name)
    if (matchIndex > -1) {
      all.push(routes[matchIndex])
    }
  })
  return all
}

// 递归平铺菜单树
function getAsyncRouter(functions) {
  let all = []
  const mapper = (route) => {
    if (route.name && !route.children) {
      all.push({ ...route })
    }
    if (route.children) {
      route.children.forEach(item => {
        mapper(item)
      })
    }
  }
  functions.forEach(item => {
    mapper(item)
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
    generateRoutes({ commit }, menus) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRoutes(asyncRouterMap, menus)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
