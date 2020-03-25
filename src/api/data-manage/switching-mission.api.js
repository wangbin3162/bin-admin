// 交换任务管理
import request from '../request'

/* 查询交换任务列表 */
export function getMissionList(query) {
  return request({
    url: '/api/dir/exchange/detail/search',
    method: 'get',
    params: {
      size: query.size,
      page: query.page - 1,
      resourceName: query.resourceName,
      flowDirection: query.flowDirection,
      changeType: query.changeType,
      availableStatus: query.availableStatus
    }
  })
}

/* 查询交换任务详情信息 */
export function getMissionDetail(id) {
  return request({
    url: '/api/dir/exchange/detail/detail',
    method: 'get',
    params: {
      id
    }
  })
}

/* 获取交换任务数据源信息 */
export function queryDataSourceByCfgId(cfgId) {
  return request({
    url: '/api/dir/exchange/detail/queryDataSourceByCfgId',
    method: 'get',
    params: {
      cfgId
    }
  })
}

/* 增加任务 */
export function createMission(mission) {
  return request({
    url: '/api/dir/exchange/detail/create',
    method: 'post',
    data: {
      configId: mission.configId,
      resourceKey: mission.resourceKey,
      resourceName: mission.resourceName,
      metadataKey: mission.metadataKey,
      nodeTableName: mission.nodeTableName,
      exInfoDesc: mission.exInfoDesc,
      itemMap: mission.itemMap,
      validValue: mission.validValue
    }
  })
}

/* 修改任务 */
export function modifyMission(mission) {
  return request({
    url: '/api/dir/exchange/detail/modify',
    method: 'post',
    data: {
      id: mission.id,
      configId: mission.configId,
      resourceKey: mission.resourceKey,
      resourceName: mission.resourceName,
      metadataKey: mission.metadataKey,
      nodeTableName: mission.nodeTableName,
      exInfoDesc: mission.exInfoDesc,
      itemMap: mission.itemMap,
      validValue: mission.validValue
    }
  })
}

/* 删除任务 */
export function removeMission(id) {
  return request({
    url: '/api/dir/exchange/detail/delete',
    method: 'post',
    params: {
      id
    }
  })
}

/* 启用禁用任务信息 */
export function changeStatus(id, status) {
  return request({
    url: '/api/dir/exchange/detail/changeStatus',
    method: 'get',
    params: {
      id,
      status
    }
  })
}
