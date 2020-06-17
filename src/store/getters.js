const getters = {
  // 用户角色
  userRoles: state => state.user.roles,
  // 用户信息
  userInfo: state => state.user.info,
  // 查询条件
  queryData: state => state.search.query
}

export default getters
