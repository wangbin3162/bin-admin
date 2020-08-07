const esExchange = {
  state: {
    esSycnStatus: { // 运行状态
      COMPLETED: '已完成',
      STARTED: '进行中',
      FAILED: '失败'
    },
    personClass: {}, // 主体类别枚举
    resProperty: {} // 资源性质枚举
  },
  mutations: {
    SET_ES_SYNC_STATUS (state, esSyncStatus) {
      state.esSyncStatus = esSyncStatus
    },
    SET_PERSON_CLASS (state, personClass) {
      state.personClass = personClass
    },
    SET_RES_PROPERTY (state, resProperty) {
      state.resProperty = resProperty
    }
  },
  actions: {}
}

export default esExchange
