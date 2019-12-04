export default {
  state: {
    query: {
      type: '1', // 1法人，2自然人
      reason: '', // 1核查报告，2信用档案
      q: '', // 查询条件
      id: '' // 信用主体id
    }
  },
  mutations: {
    SET_QUERY: (state, query) => {
      state.query = { ...state.query, ...query }
    }
  },
  actions: {
    setQuery ({ commit }, query) {
      commit('SET_QUERY', query)
    }
  }
}
