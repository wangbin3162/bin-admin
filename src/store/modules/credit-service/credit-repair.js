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
    },
    lrlxEnum: { // 录入类型枚举
      1: '信用修复',
      2: '批量退出'
    },
    ztEnum: { // 名单有效状态
      1: '有效',
      2: '无效'
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
    },
    SET_LRLX_ENUM(state, lrlxEnum) {
      state.lrlxEnum = lrlxEnum
    },
    SET_ZT_ENUM(state, ztEnum) {
      state.ztEnum = ztEnum
    }
  },
  actions: {}
}

export default creditRepair
