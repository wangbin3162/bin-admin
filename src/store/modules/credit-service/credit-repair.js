const creditRepair = {
  state: {
    configTypeEnum: { // 配置类型
      hmd: '黑名单',
      xzcf: '行政处罚'
    },
    statusEnum: { // 审核状态
      1: '待审核',
      2: '已审核'
    },
    dealModeEnum: { // 处理方式
      1: '申请修复',
      2: '同意修复',
      3: '拒绝修复'
    }
  },
  mutations: {
    SET_CONFIG_TYPE_ENUM(state, configTypeEnum) {
      state.configTypeEnum = configTypeEnum
    },
    SET_STATUS_ENUM(state, statusEnum) {
      state.statusEnum = statusEnum
    },
    SET_DEAL_MODE_ENUM(state, dealModeEnum) {
      state.dealModeEnum = dealModeEnum
    }
  },
  actions: {}
}

export default creditRepair
