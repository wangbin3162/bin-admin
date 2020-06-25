import cookies from './util.cookies'
import binUtil from 'bin-ui/src/utils/util'

const util = {
  cookies
}

util.timeFix = function () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}
util.cloneDeep = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}
util.downloadFile = function (content, fileName) {
  // filename，摘取了常用的部分，其实还有其他一些
  //    'exe'        => 'application/octet-stream',
  //    'pdf'        => 'application/pdf',
  //    'xls'        => 'application/vnd.ms-excel',
  //    'ppt'        => 'application/vnd.ms-powerpoint',
  //    'js'         => 'application/x-javascript',
  //    'zip'        => 'application/zip',
  //    'mp3'        => 'audio/mpeg',
  //    'bmp'        => 'image/bmp',
  //    'gif'        => 'image/gif',
  //    'jpeg'       => 'image/jpeg',
  //    'jpg'        => 'image/jpeg',
  //    'png'        => 'image/png',
  //    'css'        => 'text/css',
  //    'html'       => 'text/html',
  //    'htm'        => 'text/html',
  //    'txt'        => 'text/plain',
  //    'xsl'        => 'text/xml',
  //    'xml'        => 'text/xml',
  let data = new Blob([content], { type: 'application/vnd.ms-excel' })
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(data, fileName)
  } else {
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}

export default util

/**
 * @author haodongdong
 * @description 枚举类型的key value对象转换为可用于渲染option标签的数组
 * @param {*} enumData
 * @returns [{label, value}]
 */
export function enumToOptions (enumData) {
  const options = []
  for (const key in enumData) {
    if (enumData.hasOwnProperty(key)) {
      const element = enumData[key]
      options.push({
        label: enumData[key],
        value: key
      })
    }
  }
  return options
}

/**
 * @author haodongdong
 * @description 获取时间范围
 * @param {number} days 间隔时间
 * @param {string} [mode = {y}-{m}] 定义返回的日期字符串格式，默认返回yyyy-mm形式
 * @returns {
   {
     startDate: Date,
     endDate: Date,
     startDateStr: string,
     endDateStr: string
   }
 } Object
 */
export function getTimeRange(days, mode = '{y}-{m}') {
  const startDate = new Date()
  const endDate = new Date()
  startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * days)

  const startDateStr = binUtil.parseTime(startDate, mode)
  const endDateStr = binUtil.parseTime(endDate, mode)

  return {
    startDate,
    endDate,
    startDateStr,
    endDateStr
  }
}
