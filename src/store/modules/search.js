export default {
  state: {
    searchData: {
      type: '1',
      reason: '', // TODO 查询原因暂时没实现功能
      q: '大米科技'
    },
    detailId: 'b51788af29164d98a970db492c02ea7d' // 设置默认id:b51788af29164d98a970db492c02ea7d
  },
  mutations: {
    SET_SEARCH_DATA: (state, data) => {
      state.searchData = { ...data }
    },
    SET_DETAIL_ID: (state, id) => {
      state.detailId = id
    }
  },
  actions: {
    // 设置查询参数q
    setQuery ({ commit, state }, query) {
      state.searchData.q = query
    },
    // 缓存查询条件
    setSearchData ({ commit }, query) {
      commit('SET_SEARCH_DATA', query)
    },
    // 仅设置查询参数
    setDetailId ({ commit }, id) {
      commit('SET_DETAIL_ID', id || '')
    }
  }
}
