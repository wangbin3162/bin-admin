const getters = {
  // 用户角色
  roles: state => state.user.roles,
  // 用户信息
  userInfo: state => state.user.info,
  // 查询条件
  searchData: state => state.search.searchData
}

export default getters
