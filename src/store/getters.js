const getters = {
  theme: state => state.app.theme,
  // 侧边栏开关
  sidebar: state => state.app.sidebar,
  // 菜单类型
  menuType: state => state.app.menuType,
  // 顶部菜单
  headerMenu: state => state.app.headerMenu,
  // 侧边栏菜单
  asideMenu: state => state.app.asideMenu,
  // 用户角色
  roles: state => state.user.roles,
  // 用户信息
  userInfo: state => state.user.info,
  // 开启的路由信息（可以开启的菜单路由）
  routers: state => state.permission.routers,
  // 开启的路由信息（可以开启的菜单路由）
  addRouters: state => state.permission.addRouters,
  // 可显示的视图tab
  visitedViews: state => state.tagsView.visitedViews,
  // 用于缓存keepAlive的路由
  cachedViews: state => state.tagsView.cachedViews
}

export default getters
