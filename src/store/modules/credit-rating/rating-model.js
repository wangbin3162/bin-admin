// 把类目的树形数据转换为级联选择框可用的树形结构
function treeToCascade(tree) {
  const list = []
  for (const item of tree) {
    const obj = {
      label: item.text,
      value: item.code,
      children: []
    }
    if (item.children && item.children.length > 0) {
      obj.children = treeToCascade(item.children)
    }
    list.push(obj)
  }
  return list
}

const ratingModel = {
  state: {
    subjectType: [], // 主体类别级联框数据结构
    personClassEnum: {} // 主题类别枚举结构
  },
  mutations: {
    SET_SBUJECT_TYPE (state, subjectType) {
      state.subjectType = subjectType
    },
    SET_PERSON_CLASS_ENUM (state, personClassEnum) {
      state.personClassEnum = personClassEnum
    }
  },
  actions: {
    // 构建主体类别级联选择框使用的数据结构
    buildSubjectType ({ commit }, subjectTypeTree) {
      return new Promise((resolve, reject) => {
        const list = treeToCascade(subjectTypeTree)
        const sub = list[0].children
        commit('SET_SBUJECT_TYPE', sub)
        resolve(sub)
      })
    }
  }
}

export default ratingModel
