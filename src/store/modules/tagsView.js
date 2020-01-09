const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    // 添加顶部的显示tag
    ADD_VISITED_VIEW: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
    },
    // 缓存的keepAlive view
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEW: (state, view) => {
      state.visitedViews.splice(state.visitedViews.findIndex(t => t.path === view.path), 1)
    },
    DEL_CACHED_VIEW: (state, view) => {
      state.cachedViews.splice(state.cachedViews.indexOf(view.name), 1)
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter(v => {
        return v.meta.affix || v.path === view.path
      })
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, index + 1)
          break
        }
      }
    },
    // 删除所有显示tag
    DEL_ALL_VISITED_VIEWS: state => {
      // keep affix tags
      // const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
      state.visitedViews = state.visitedViews.filter(tag => tag.meta.affix)
    },
    DEL_ALL_CACHED_VIEWS: state => {
      // keep affix tags
      const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
      state.cachedViews = []
      affixTags.forEach(tag => {
        state.cachedViews.push(tag.name)
      })
    }
  },
  actions: {
    // 增加view 标签 Tag ，这里会增加到tag和缓存view
    addView ({ commit }, view) {
      commit('ADD_VISITED_VIEW', view)
      commit('ADD_CACHED_VIEW', view)
    },
    delView ({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delVisitedView', view)
        dispatch('delCachedView', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delVisitedView ({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedView ({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])
      })
    },
    delOthersViews ({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', view)
        dispatch('delOthersCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delOthersVisitedViews ({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersCachedViews ({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', view)
        resolve([...state.cachedViews])
      })
    },
    delAllViews ({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews', view)
        dispatch('delAllCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllVisitedViews ({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews ({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    }
  }
}

export default tagsView
