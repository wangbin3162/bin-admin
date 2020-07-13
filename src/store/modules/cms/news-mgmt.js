const newsMgmt = {
  state: {
    colType: {}, // 栏目类型
    conType: {}, // 内容类型
    conStatus: {}, // 内容状态
    pageStatus: 'info' // 页面状态，用于切换显示、新增、编辑等页面
  },
  getters: {
    isInfo: state => {
      return state.pageStatus === null || state.pageStatus === '' || state.pageStatus === 'info'
    },
    isEdit: state => {
      return state.pageStatus === 'create' || state.pageStatus === 'edit'
    }
  },
  mutations: {
    SET_COL_TYPE (state, colType) {
      state.colType = colType
    },
    SET_CON_TYPE (state, conType) {
      state.conType = conType
    },
    SET_CON_STATUS (state, conStatus) {
      state.conStatus = conStatus
    },
    SET_PAGE_STATUS (state, pageStatus) {
      state.pageStatus = pageStatus
    }
  },
  actions: {
    setPageStatus ({ commit }, status) {
      commit('SET_PAGE_STATUS', status)
    }
  }
}

export default newsMgmt
