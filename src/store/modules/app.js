import { getSidebarStatus, setSidebarStatus } from '../../common/js/cache'

const app = {
  state: {
    sidebar: getSidebarStatus()
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar = !state.sidebar
      setSidebarStatus(state.sidebar)
    }
  },
  actions: {
    toggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
