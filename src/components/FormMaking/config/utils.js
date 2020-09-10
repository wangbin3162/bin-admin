// 表单设计器所需的工具函数
export function getKey(prefix) {
  const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
  return prefix ? (prefix + '_' + key) : key
}
