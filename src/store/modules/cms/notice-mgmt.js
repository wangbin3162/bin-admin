const noticeMgmt = {
  state: {
    noticeType: {}, // 通知类型
    noticeStatus: {} // 通知状态
  },
  mutations: {
    SET_NOTICE_TYPE (state, noticeType) {
      state.noticeType = noticeType
    },
    SET_NOTICE_STATUS (state, noticeStatus) {
      state.noticeStatus = noticeStatus
    }
  }
}

export default noticeMgmt
