/* 奖惩措施接口 */
import request from '../request'

/* 3.2.1.1奖惩措施列表 */
export function getMeasureList(query) {
  return request({
    url: 'api/urp/measure/search',
    method: 'get',
    params: {
      measureName: query.measureName,
      measureType: query.measureType,
      departId: query.departId,
      page: query.page - 1,
      size: query.size
    }
  })
}

/* 奖惩措施新增 */
export function createMeasure(measure) {
  return request({
    url: '/api/urp/measure/create',
    method: 'post',
    data: {
      measureName: measure.measureName,
      measureType: measure.measureType,
      departId: measure.departId,
      departName: measure.departName,
      measureContent: measure.measureContent
    }
  })
}

/* 奖惩措施修改 */
export function modifyMeasure(measure) {
  return request({
    url: '/api/urp/measure/modify',
    method: 'post',
    data: {
      id: measure.id,
      measureName: measure.measureName,
      measureType: measure.measureType,
      departId: measure.departId,
      departName: measure.departName,
      measureContent: measure.measureContent
    }
  })
}

/* 删除 */
export function removeMeasure(measure) {
  return request({
    url: '/api/urp/measure/remove',
    method: 'post',
    params: {
      id: measure.id
    }
  })
}

/* 同一部门措施名称是否唯一 */
export function oneMeasureName(measure) {
  return request({
    url: '/api/urp/measure/checkMeasureNameExists',
    method: 'get',
    params: {
      id: measure.id || '',
      measureName: measure.measureName,
      departId: measure.departId
    }
  })
}
