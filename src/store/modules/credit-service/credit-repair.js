const creditRepair = {
  state: {
    configTypeEnum: { // 配置类型
      hmd: '黑名单',
      xzcf: '行政处罚'
    }
  },
  mutations: {
    SET_CONFIG_TYPE_ENUM(state, configTypeEnum) {
      state.configTypeEnum = configTypeEnum
    }
  },
  actions: {}
}

export default creditRepair
