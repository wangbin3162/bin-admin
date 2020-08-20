const creSupDetail = {
  state: {
    detailRes: {}, // 详情数据
    recentDynamic: [], // 近期动态
    redBlackListInfo: [], // 红黑名单信息
    focusScopeSupervision: [] // 重点领域监管
  },
  mutations: {
    SET_DETAIL_RES (state, detailRes) {
      state.detailRes = detailRes
    },
    SET_RECENT_DYNAMIC (state, recentDynamic) {
      state.recentDynamic = recentDynamic
    },
    SET_RED_BLACK_LIST_INFO (state, redBlackListInfo) {
      state.redBlackListInfo = redBlackListInfo
    },
    SET_FOCUS_SCOPE_SUPERVISION (state, focusScopeSupervision) {
      state.focusScopeSupervision = focusScopeSupervision
    }
  }
}

export default creSupDetail
