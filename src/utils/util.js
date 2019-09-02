import cookies from './util.cookies'
import log from './log'

const util = {
  cookies,
  log
}

util.timeFix = function () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}
util.cloneDeep = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default util
