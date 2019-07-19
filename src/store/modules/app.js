import { getSidebarStatus, setSidebarStatus } from '../../core/js/cache'
import setting from '../../config/defaultSettings'

const app = {
  state: {
    sidebar: getSidebarStatus(),
    themeName: setting.theme,
    headerMenu: [
      { path: '/index', title: '首页', icon: 'ios-home' }
    ],
    asideMenu: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar = !state.sidebar
      setSidebarStatus(state.sidebar)
    },
    SET_HEADER_MENU: (state, menu) => {
      state.headerMenu = menu
    }
  },
  actions: {
    toggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    setHeaderMenu: ({ commit }, routes) => {
      const menu = filterMenu(routes)
      menu.unshift({ path: '/', title: '首页', icon: 'ios-home' })
      commit('SET_HEADER_MENU', menu)
      console.log(menu)
    }
  }
}

// 过滤菜单
function filterMenu (routes) {
  let arr = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.path !== '*' || !tmp.hidden) { // 过滤顶级菜单，即，404和已经隐藏的
      if (tmp.children) {
        tmp.children = filterMenu(tmp.children)
      }
      let obj = {}
      obj.path = tmp.path
      obj.title = tmp.meta.title
      if (tmp.meta.icon) {
        obj.icon = tmp.meta.icon
      }
      if (tmp.children) {
        obj.children = tmp.children
      }
      arr.push(obj)
    }
  })
  return arr
}

export default app
