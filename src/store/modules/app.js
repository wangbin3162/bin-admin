import { getAdminSetting, setAdminSetting } from '../../core/js/cache'

const app = {
  state: {
    sidebar: true,
    theme: '',
    menuType: '',
    headerMenu: [
      { path: '/index', title: '首页', icon: 'ios-home' }
    ],
    asideMenu: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar = !state.sidebar
      setAdminSetting({
        theme: state.theme,
        sidebar: state.sidebar,
        menuType: state.menuType
      })
    },
    SET_THEME: (state, theme) => {
      state.theme = theme
      // 设置全局样式前缀
      document.body.className = `theme-${theme}`
      setAdminSetting({
        theme: state.theme,
        sidebar: state.sidebar,
        menuType: state.menuType
      })
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
    },
    // 载入时加载本地存储数据和主题配置信息
    loadApp: ({ commit }) => {
      const setting = getAdminSetting()
      if (!setting.sidebar) {
        commit('TOGGLE_SIDEBAR')
      }
      if (setting.theme) {
        commit('SET_THEME', setting.theme)
      }
    },
    setThemeMode: ({ commit }, theme) => {
      console.log(theme)
      commit('SET_THEME', theme)
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
