// 类目管理
import request from '../request'

// 2.5.1 获取资源信息数量
export function getClassifyDataCount() {
  return request({
    url: '/da/data/collect/zyxxsl',
    method: 'get'
  })
}
// 2.5.2 获取数据归集总量
export function getClassifyTotalCount() {
  return request({
    url: '/da/data/collect/sjgjzl',
    method: 'get'
  })
}
// 2.5 3 获取本月归集数据量
export function getClassifyMonthCount() {
  return request({
    url: '/da/data/collect/bygjsjl',
    method: 'get'
  })
}
// 2.5.4 获取自然人数据总量
export function getClassifyZrpCount() {
  return request({
    url: '/da/data/collect/zrpcount',
    method: 'get'
  })
}
// 2.5.5 获取法人或其他组织数据总量
export function getClassifyFoCount() {
  return request({
    url: '/da/data/collect/focount',
    method: 'get'
  })
}
// 2.5.6 月度信息归集趋势图
export function getYearCollectData (year = new Date().getFullYear()) {
  return request({
    url: '/da/data/collect/ydxxgjqs',
    method: 'get',
    params: {
      year
    }
  })
}
// 2.5.7 本月数据分析
export function getMonthCollectData (month) {
  return request({
    url: '/da/data/collect/bysjfx',
    method: 'get',
    params: {
      month
    }
  })
}
// 2.5.8 按部门数据归集统计
export function getDeptCollectData () {
  return request({
    url: '/da/data/collect/bmsjfx',
    method: 'get'
  })
}
// 2.5.9 资源信息分类统计
export function getResourceData () {
  return request({
    url: '/da/data/collect/zyxxfltj',
    method: 'get'
  })
}
// 2.5.12 主体及资源数据分析
export function getSubjectData () {
  return request({
    url: '/da/data/collect/ztzysjfx',
    method: 'get'
  })
}
