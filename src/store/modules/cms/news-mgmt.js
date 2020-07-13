const newsMgmt = {
  state: {
    colType: {}, // 栏目类型
    conType: {}, // 内容类型
    conStatus: {} // 内容状态
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
    }
  }
}

export default newsMgmt
