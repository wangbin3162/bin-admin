export default {
  namespaced: true,
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEW: (state, view) => {
      if (state.visitedViews.some(v => v.name === view.name)) return
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.title || 'no-name'
        })
      )
    },
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      state.cachedViews.push(view.name)
    },
    DEL_VISITED_VIEW: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.name === view.name) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW: (state, view) => {
      const index = state.cachedViews.indexOf(view.name)
      index > -1 && state.cachedViews.splice(index, 1)
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter(v => v.name === view.name)
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      const index = state.cachedViews.indexOf(view.name)
      if (index > -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1)
      } else {
        // if index = -1, there is no cached tags
        state.cachedViews = []
      }
    },
    DEL_ALL_VISITED_VIEWS: state => {
      // keep affix tags
      state.visitedViews = []
    },
    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = []
    },
    UPDATE_VISITED_VIEW: (state, view) => {
      for (let v of state.visitedViews) {
        if (v.name === view.name) {
          v = Object.assign(v, view)
          break
        }
      }
    }
  },
  actions: {
    addView({ commit }, view) {
      commit('ADD_VISITED_VIEW', view)
      commit('ADD_CACHED_VIEW', view)
    },
    delView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        commit('DEL_CACHED_VIEW', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delCachedView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      console.log(view)
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
        commit('DEL_OTHERS_CACHED_VIEWS', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        commit('DEL_ALL_CACHED_VIEWS')
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    updateVisitedView({ commit }, view) {
      commit('UPDATE_VISITED_VIEW', view)
    }
  }
}
