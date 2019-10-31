// 查询相关缓存
export default {
  state: {
    searchData: {
      type: '1',
      reason: '',
      q: ''
    }
  },
  mutations: {
    SET_SEARCH_DATA: (state, data) => {
      state.searchData = { ...data }
    }
  },
  actions: {
    // 设置查询参数
    setSearchData ({ commit }, data) {
      return new Promise((resolve, reject) => {
        if (data && data.q.length > 0) {
          commit('SET_SEARCH_DATA', data)
          resolve()
        } else {
          reject(new Error('查询条件结果范围过大'))
        }
      })
    },
    // 设置查询参数q
    setQuery ({ commit, state }, query) {
      state.searchData.q = query
    }
  }
}
