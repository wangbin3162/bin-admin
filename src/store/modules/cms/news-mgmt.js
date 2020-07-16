const newsMgmt = {
  state: {
    colType: {}, // 栏目类型
    contentType: {}, // 内容类型
    contentStatus: {} // 内容状态
  },
  mutations: {
    SET_COL_TYPE (state, colType) {
      state.colType = colType
    },
    SET_CONTENT_TYPE (state, contentType) {
      state.contentType = contentType
    },
    SET_CONTENT_STATUS (state, contentStatus) {
      state.contentStatus = contentStatus
    }
  }
}

export default newsMgmt
