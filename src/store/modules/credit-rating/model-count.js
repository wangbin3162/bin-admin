const modelCount = {
  state: {
    modelList: [] // 评价方案(评级模型)列表，用于渲染option
  },
  mutations: {
    SET_MODEL_LIST(state, modelList) {
      state.modelList = modelList
    }
  },
  actions: {}
}

export default modelCount
