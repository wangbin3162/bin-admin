// 参数配置
import request from '../request'

/* 获取参数类型树 */
export function getTypeTree(typeCode) {
  return request({
    url: '/management/confType/tree',
    method: 'get',
    params: {
      typeCode: typeCode
    }
  })
}

/* 获取所有参数设置列表 */
export function getConfList(query) {
  return request({
    url: '/management/conf/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      confName: query.confName,
      confCode: query.confCode,
      typeId: query.typeId,
      sort: 'sortNum,asc'
    }
  })
}

/* 新增参数设置 */
export function createConf(conf) {
  return request({
    url: '/management/conf/create',
    method: 'post',
    data: {
      typeId: conf.typeId,
      confName: conf.confName,
      confCode: conf.confCode,
      confValue: conf.confValue,
      realValue: conf.realValue,
      valueMode: conf.valueMode,
      valueRange: conf.valueRange,
      realValueRange: conf.realValueRange,
      sortNum: conf.sortNum,
      desc: conf.desc
    }
  })
}

/* 修改参数设置 */
export function modifyConf(conf) {
  return request({
    url: '/management/conf/modify',
    method: 'post',
    data: {
      id: conf.id,
      typeId: conf.typeId,
      confName: conf.confName,
      confCode: conf.confCode,
      confValue: conf.confValue,
      realValue: conf.realValue,
      valueMode: conf.valueMode,
      valueRange: conf.valueRange,
      realValueRange: conf.realValueRange,
      sortNum: conf.sortNum,
      desc: conf.desc
    }
  })
}

/* 参数设置 */
export function setConf(conf) {
  return request({
    url: '/management/conf/modify',
    method: 'post',
    data: {
      id: conf.id,
      confValue: conf.confValue,
      realValue: conf.realValue
    }
  })
}

/* 删除参数设置 */
export function removeConf(conf) {
  return request({
    url: '/management/conf/remove',
    method: 'post',
    params: {
      id: conf.id
    }
  })
}

/* 参数名称是否唯一 */
export function oneConfName(conf) {
  return request({
    url: '/management/conf/checkNameExists',
    method: 'get',
    params: {
      id: conf.id || '',
      confName: conf.confName
    }
  })
}

/* 参数编码是否唯一 */
export function oneConfCode(conf) {
  return request({
    url: '/management/conf/checkCodeExists',
    method: 'get',
    params: {
      id: conf.id || '',
      confCode: conf.confCode
    }
  })
}
