import { getAdminSetting, setAdminSetting } from '../../common/config/datastore'

const app = {
  state: {
    setting: {
      sidebar: true,
      theme: '',
      menuType: '',
      wideType: 'wide', // 内容区域宽度 [wide:固定,flow:流式]
      fixedHeader: false,
      fixedAside: false
    },
    menu: [],
    licStatus: true // /lic/check 证书验证状态，默认为true
  },
  mutations: {
    SAVE_SETTING: (state, setting) => {
      state.setting = { ...setting }
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    },
    SET_SIDEBAR: (state) => {
      state.setting.sidebar = !state.setting.sidebar
      setAdminSetting(state.setting)
    },
    SET_THEME: (state, theme) => {
      state.setting.theme = theme
      setAdminSetting(state.setting)
    },
    SET_MENU_TYPE: (state, type) => {
      state.setting.menuType = type
      setAdminSetting(state.setting)
    },
    SET_WIDE_TYPE: (state, type) => {
      state.setting.wideType = type
      setAdminSetting(state.setting)
    },
    TOGGLE_FIXED_HEADER: (state, isFixed) => {
      state.setting.fixedHeader = isFixed
      setAdminSetting(state.setting)
    },
    TOGGLE_FIXED_ASIDE: (state, isFixed) => {
      state.setting.fixedAside = isFixed
      setAdminSetting(state.setting)
    },
    SET_LIC_STATUS (state, licStatus) {
      state.licStatus = licStatus
    }
  },
  actions: {
    // 载入时加载本地存储数据和主题配置信息
    loadApp: ({ commit }) => {
      // 存储设置对象
      const setting = getAdminSetting()
      commit('SAVE_SETTING', setting)
      document.body.className = `theme-${setting.theme}`
    },
    setRouterMenu: ({ commit, state }, routes) => {
      const menu = filterMenu(routes)
      menu.unshift({ path: '/index', title: '首页', icon: 'ios-home' })
      commit('SET_MENU', menu)
    },
    toggleSideBar: ({ commit }) => {
      commit('SET_SIDEBAR')
    },
    setThemeMode: ({ commit }, theme) => {
      document.body.className = `theme-${theme}`
      commit('SET_THEME', theme)
    },
    setMenuType: ({ commit }, type) => {
      commit('SET_MENU_TYPE', type)
    },
    setWideType: ({ commit }, type) => {
      commit('SET_WIDE_TYPE', type)
    },
    toggleFixedHeader: ({ commit }, isFixed) => {
      commit('TOGGLE_FIXED_HEADER', isFixed)
    },
    toggleFixedAside: ({ commit }, isFixed) => {
      commit('TOGGLE_FIXED_ASIDE', isFixed)
    }
  }
}

// 过滤菜单
function filterMenu(routes) {
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
