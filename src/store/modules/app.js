import { getSidebarStatus, setSidebarStatus } from '../../core/js/cache'
import setting from '../../config/defaultSettings'

const app = {
  state: {
    sidebar: getSidebarStatus(),
    themeName: setting.theme
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
