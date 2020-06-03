const creditRepair = {
  state: {
    configTypeEnum: { // 配置类型
      hmd: '黑名单',
      xzcf: '行政处罚'
    },
    statusEnum: {
      1: '待审核',
      2: '已审核'
    }
  },
  mutations: {
    SET_CONFIG_TYPE_ENUM(state, configTypeEnum) {
      state.configTypeEnum = configTypeEnum
    },
    SET_STATUS_ENUM(state, statusEnum) {
      state.statusEnum = statusEnum
    }
  },
  actions: {}
}

export default creditRepair
