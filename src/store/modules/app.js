import { getAdminSetting, setAdminSetting } from '../../utils/datastore'
import log from '../../utils/log'

const app = {
  state: {
    sidebar: true,
    theme: '',
    menuType: '',
    headerMenu: [],
    asideMenu: []
  },
  mutations: {
    SET_SIDEBAR: (state, val) => {
      state.sidebar = val
      setAdminSetting({
        theme: state.theme,
        sidebar: state.sidebar,
        menuType: state.menuType
      })
    },
    SET_THEME: (state, theme) => {
      state.theme = theme
      setAdminSetting({
        theme: state.theme,
        sidebar: state.sidebar,
        menuType: state.menuType
      })
    },
    SET_MENU_TYPE: (state, type) => {
      state.menuType = type
      setAdminSetting({
        theme: state.theme,
        sidebar: state.sidebar,
        menuType: state.menuType
      })
    },
    SET_HEADER_MENU: (state, menu) => {
      state.headerMenu = menu
    },
    SET_ASIDE_MENU: (state, menu) => {
      state.asideMenu = menu
    }
  },
  actions: {
    toggleSideBar: ({ commit, state }) => {
      commit('SET_SIDEBAR', !state.sidebar)
    },
    setHeaderMenu: ({ commit, state }, routes) => {
      const menu = filterMenu(routes)
      menu.unshift({ path: '/index', title: '首页', icon: 'ios-home' })
      if (state.menuType === 'header') {
        commit('SET_HEADER_MENU', menu)
      } else {
        commit('SET_ASIDE_MENU', menu)
      }
      // console.log(menu)
    },
    // 载入时加载本地存储数据和主题配置信息
    loadApp: ({ commit }) => {
      const { sidebar, theme, menuType } = getAdminSetting()
      // 1.设置sidebar开启开关
      commit('SET_SIDEBAR', sidebar)
      // 2.设置全局样式前缀
      document.body.className = `theme-${theme}`
      commit('SET_THEME', theme)
      // 3. 设置菜单栏位置
      commit('SET_MENU_TYPE', menuType)
      log.success('>>>>>>loadApp>>>>>>')
    },
    setThemeMode: ({ commit }, theme) => {
      document.body.className = `theme-${theme}`
      commit('SET_THEME', theme)
    }
  }
}

// 过滤菜单 // 第二个参数为基础path
function filterMenu (routes) {
  let arr = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.path !== '*' || !tmp.hidden) { // 过滤顶级菜单，即，404和已经隐藏的
      if (tmp.children) {
        tmp.children = filterMenu(tmp.children)
      }
      let obj = {}
      obj.path = tmp.path // 这里的路由path默认都为不带/
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
