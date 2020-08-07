const esExchange = {
  state: {
    esSycnStatus: { // 运行状态
      COMPLETED: '已完成',
      STARTED: '进行中',
      FAILED: '失败'
    },
    personClass: {}, // 主体类别枚举
    resProperty: {}, // 资源性质枚举
    resPropertyOptions: [] // 资源性质级联选择框使用的数据
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
    },
    SET_RES_PROPERTY_OPTIONS (state, resPropertyOptions) {
      state.resPropertyOptions = resPropertyOptions
    }
  },
  actions: {}
}

export default esExchange
