import { asyncRouterMap, constantRouterMap } from '../../router/routes'
import path from 'path'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除,这里暂时通过这种方式获取
 *
 * @param functions 所有用户路由权限列表
 * @param  route 路由
 * @param basePath
 * @returns {boolean}
 */
function hasPermission(functions, route, basePath = '') {
  if (route.meta && route.meta.roles) {
    return true
  } else {
    const tempPath = path.resolve(basePath, route.path)
    // 开锁调试查看匹配路由是否正确
    // const flag = tempPath === '/*' || functions.includes(tempPath)
    // let title = route.meta ? route.meta.title : basePath.length === 0 ? '父路由' : '子路由'
    // console.log(title, `${tempPath} 匹配${flag ? '成功' : '失败'}`, flag ? 'primary' : 'danger')
    // return flag
    return tempPath === '/*' || functions.includes(tempPath)
  }
}

function filterAsyncRoutes(routes, functions, basePath = '') {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(functions, tmp, basePath)) {
      const tempPath = path.resolve(basePath, tmp.path)
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, functions, tempPath)
      }
      if (!tmp.children || tmp.children.length > 0) {
        res.push(tmp)
      }
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
    generateRoutes({ commit }, functions) {
      return new Promise(resolve => {
        // console.log(functions)
        const accessedRouters = filterAsyncRoutes(asyncRouterMap, functions)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
