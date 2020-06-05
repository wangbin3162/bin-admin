export default {
  state: {
    query: {
      type: '1', // 1法人，2自然人
      reason: '',
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
    setQuery({ commit }, query) {
      commit('SET_QUERY', query)
    },
    resetQuery({ commit }) {
      commit('SET_QUERY', { type: '1', reason: '', q: '', id: '' })
    }
  }
}
