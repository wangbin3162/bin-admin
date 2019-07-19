const getters = {
  theme: state => state.app.theme,
  // 侧边栏开关
  sidebar: state => state.app.sidebar,
  // 顶部菜单
  headerMenu: state => state.app.headerMenu,
  // 侧边栏菜单
  asideMenu: state => state.app.asideMenu,
  // 用户角色
  roles: state => state.user.roles,
  // 用户信息
  userInfo: state => state.user.info,
  // 开启的路由信息
  addRouters: state => state.permission.addRouters
}

export default getters
