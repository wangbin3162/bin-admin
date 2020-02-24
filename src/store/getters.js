const getters = {
  theme: state => state.app.setting.theme,
  sidebar: state => state.app.setting.sidebar,
  menuType: state => state.app.setting.menuType,
  wideType: state => state.app.setting.wideType,
  fixedHeader: state => state.app.setting.fixedHeader,
  fixedAside: state => state.app.setting.fixedAside,
  // 菜单
  navMenu: state => state.app.menu,
  // 用户角色
  roles: state => state.user.roles,
  // 用户信息
  userInfo: state => state.user.info,
  // 开启的路由信息（可以开启的菜单路由）
  routers: state => state.permission.routers,
  // 开启的路由信息（可以开启的菜单路由）
  addRouters: state => state.permission.addRouters
}

export default getters
