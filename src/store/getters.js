const getters = {
  sidebar: state => state.app.sidebar,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters
}

export default getters
