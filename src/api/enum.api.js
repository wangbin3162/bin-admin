// 所有枚举值请求
import request from './request'

// 用户枚举
export function getUserStatus() {
  return request.get('/management/enum/commStatus', {
    type: 'init'
  })
}

// 部门枚举
export function getDeptStatus() {
  return request.get('/management/enum/commStatus', {
    type: 'norm'
  })
}

// 部门类型枚举
export function getDeptType() {
  return request.get('/management/enum/departType')
}

// 通用yes no 枚举
export function getYn() {
  return request.get('/management/enum/yn')
}

// 菜单类型枚举
export function getMenuType() {
  return request.get('/management/enum/menuType')
}

// 配置取值模式枚举
export function getValueMode() {
  return request.get('/management/enum/valueMode')
}

// 角色类型枚举
export function getRoleType() {
  return request.get('/management/enum/roleType')
}

// 字典类型枚举
export function getDictType() {
  return request.get('/management/enum/dictType')
}

// 以下是目录管理相关枚举接口

// 3.1.1.1 元信息或资源信息状态枚举接口
export function getMetadataStatus() {
  return request.get('/api/enum/metadata/status')
}

// 3.1.1.2 元信息字段数据类型枚举
export function getDataType() {
  return request.get('/api/enum/metadata/field/dataType')
}

// 3.1.1.3 资源信息有效状态枚举
export function getAvailableStatus() {
  return request.get('/api/enum/dir/availableStatus')
}

// 3.1.1.4 资源信息状态枚举
export function getResStatus() {
  return request.get('/api/enum/dir/resStatus')
}

// 3.1.1.5 资源信息共享状态枚举
export function getShareStatus() {
  return request.get('/api/enum/dir/share')
}

// 3.1.1.6 资源信息开发属性枚举
export function getOpen() {
  return request.get('/api/enum/dir/open')
}

// 3.1.1.7 资源信息更新周期枚举
export function getUpdate() {
  return request.get('/api/enum/dir/updatePeriod')
}

// 3.1.1.8 资源信息项类型枚举
export function getFieldType() {
  return request.get('/api/enum/dir/field/requireType')
}

// 3.1.1.9 信息项公开枚举信息
export function getFieldOpenType() {
  return request.get('/api/enum/dir/field/openType')
}

// 3.1.1.10 资源信息项控件类型枚举
export function getFieldCtrl() {
  return request.get('/api/enum/dir/field/ctrl')
}

// 3.1.1.11 资源信息项状态枚举
export function getFieldStatus() {
  return request.get('/api/enum/dir/field/status')
}

// 3.1.1.13 数据源类型枚举
export function getDataSourceType() {
  return request.get('/api/enum/dir/exchange/ds')
}

// 3.1.1.14 交换节点类型枚举
export function getExchangeNodeType() {
  return request.get('/api/enum/dir/exchange/node')
}

// 3.1.1.15 交换方案信息流向枚举
export function getFlowDirection() {
  return request.get('/api/enum/dir/exchange/flowDirection')
}

// 3.1.1.16 交换方案交换类型枚举
export function getExchangeType() {
  return request.get('/api/enum/dir/exchange/exchangeType')
}

// 3.1.1.17 交换方案传输方式枚举
export function getTransmitKind() {
  return request.get('/api/enum/dir/exchange/transmitKind')
}

// 3.1.1.18 交换方案状态枚举
export function getExchangeStatus() {
  return request.get('/api/enum/dir/cfg/status')
}
