import storage from 'good-storage'

// 左侧菜单栏打卡状态
const SIDEBAR_KEY = '__sidebarStatus__'
// 用户登录信息
const USER_INFO_KEY = '__userInfo__'

export function getSidebarStatus () {
  return storage.get(SIDEBAR_KEY, true)
}

export function setSidebarStatus (status) {
  return storage.set(SIDEBAR_KEY, status)
}

export function getUser () {
  return storage.get(USER_INFO_KEY, true)
}

export function setUser (info) {
  return storage.set(USER_INFO_KEY, info)
}
