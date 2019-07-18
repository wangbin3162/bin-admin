const getters = {
  // 主题信息
  themeName: state => state.app.themeName,
  sidebar: state => state.app.sidebar,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters
}

export default getters
