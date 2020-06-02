const creditDiff = {
  state: {
    statusEnum: { // 异议状态枚举
      T0: '待初审',
      T1: '待处理',
      TR: '初审驳回',
      TF: '处理完成'
    },
    dealResultEnum: { // 处理结果枚举
      NO: '核实无误',
      CA: '取消公示',
      DE: '删除信息',
      UP: '更新信息'
    }
  },
  mutations: {
    SET_STATUS_ENUM(state, statusEnum) {
      state.statusEnum = statusEnum
    },
    SET_DEAL_RESULT_ENUM(state, dealResultEnum) {
      state.dealResultEnum = dealResultEnum
    }
  },
  actions: {}
}

export default creditDiff
