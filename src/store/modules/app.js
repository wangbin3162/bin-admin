import { getAdminSetting, setAdminSetting } from '../../utils/datastore'
import { deepCopy } from '../../utils/assist'

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
      // 这里无论是顶部菜单还是侧边菜单都给填充至顶部菜单，区别的是如果是顶部菜单，则侧边菜单是动态添加的
      commit('SET_HEADER_MENU', menu)
      if (state.menuType === 'header') {
        commit('SET_ASIDE_MENU', [])// 如果是顶部菜单，则测菜单先设置为空
      } else { // 如果开始是侧边栏模式则填充数据
        commit('SET_ASIDE_MENU', menu)
      }
    },
    setAsideMenu: ({ commit, state }, target) => {
      let arr = target.split('/')
      let parent = arr.length > 1 ? arr[0].length === 0 ? arr[1] : arr[0] : ''
      let menu = deepCopy(state.headerMenu)// 深拷贝顶层菜单
      // 过滤顶级菜单的路由并放置于侧边菜单中
      let aside = menu.filter(menu => {
        const tmp = { ...menu }
        return tmp.path.indexOf(parent) > -1 && parent !== 'index'
      })
      commit('SET_ASIDE_MENU', aside)
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
    },
    setThemeMode: ({ commit }, theme) => {
      document.body.className = `theme-${theme}`
      commit('SET_THEME', theme)
    },
    setMenuType: ({ commit, state }, type) => {
      if (type === 'header') { // 如果设置的是顶部菜单样式，则侧菜单置空
        commit('SET_ASIDE_MENU', [])
        // 如果是顶部导航，则默认收起侧边栏
        // commit('SET_SIDEBAR', false)
      } else { // 如果是侧菜单，则侧菜单设置为顶部菜单数据
        commit('SET_ASIDE_MENU', state.headerMenu)
        // commit('SET_SIDEBAR', true)
      }
      commit('SET_MENU_TYPE', type)
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
