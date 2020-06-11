const creditReportConfig = {
  state: {
    personClassEnum: {}, // 信用主体枚举
    defaultEnum: {}, // 是否设为默认枚举
    reportDefaultEnum: {}, // 信用报告启用禁用状态枚举
    reportTypeEnum: {}, // 信用报告类型枚举
    reportItemTypeEnum: {}, // 信息类类别枚举
    reportLayoutTypeEnum: {} // 布局方式枚举
  },
  mutations: {
    SET_PERSON_CLASS_ENUM(state, personClassEnum) {
      state.personClassEnum = personClassEnum
    },
    SET__DEFAULT_ENUM(state, defaultEnum) {
      state.defaultEnum = defaultEnum
    },
    SET_REPORT_DEFAULT_ENUM (state, reportDefaultEnum) {
      state.reportDefaultEnum = reportDefaultEnum
    },
    SET_REPORT_TYPE_ENUM (state, reportTypeEnum) {
      state.reportTypeEnum = reportTypeEnum
    },
    SET_REPORT_ITEM_TYPE_ENUM(state, reportItemTypeEnum) {
      state.reportItemTypeEnum = reportItemTypeEnum
    },
    SET_REPORT_LAYOUT_TYPE_ENUM(state, reportLayoutTypeEnum) {
      state.reportLayoutTypeEnum = reportLayoutTypeEnum
    }
  },
  actions: {}
}

export default creditReportConfig
