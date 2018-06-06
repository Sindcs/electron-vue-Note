// Filters
import staticConfig from './renderer/config/staticConfig'
import config from './renderer/config/index'
import util from './renderer/common/util'

export default {
  getTime: function (msec) {
    const date1 = new Date(msec)
    var now = new Date().getTime()
    var date = date1.getTime()
    var diffValue = now - date
    var minute = 1000 * 60
    var hour = minute * 60
    var day = hour * 24
    var result = ''
    if (diffValue < 0) {
      return '刚刚'
    }
    var dayC = diffValue / day
    var hourC = diffValue / hour
    var minC = diffValue / minute
    if (dayC > 3) {
      result = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + '  ' + date1.toTimeString().slice(0, 5)
    } else if (dayC <= 3 && dayC >= 1) {
      result = '' + parseInt(dayC) + '天前'
    } else if (dayC < 1 && hourC >= 1) {
      result = '' + parseInt(hourC) + '小时前'
    } else if (dayC < 1 && minC >= 1) {
      result = '' + parseInt(minC) + '分钟前'
    } else if (minC < 1) {
      result = '刚刚'
    }
    return result
  },
  formatStr: function (str) {
    return str
  },
  getUserImageUrl: function (photo) {
    if (!photo) {
      return 'images/userDefault.png'
    }
    return staticConfig.imageStoreIp + photo
  },
  getGroupImageUrl: function (photo) {
    if (!photo) {
      return 'images/groupDefault.png'
    }
    return staticConfig.imageStoreIp + photo
  },
  getNoteImage: function (url) {
    if (!url) {
      return ''
    }
    let basePath = ''
    if (process.env.NODE_ENV !== 'development') {
      basePath = '..\\..\\'
    }
    let fileName = util.getFileName(url)
    let locationUrl = `${config.tempPath.image}\\${fileName}`
    return locationUrl.replace(config.hostPath + '\\', basePath)
  },
  // 获取存储空间描述
  getSpaceTitle: function (num) {
    var kb = 1024
    var mb = 1048576
    var gb = 1073741824
    var tb = 1099511627776
    var result = num
    var unit = 'B'
    if (num < kb) {
      result = num
    } else if (num >= kb && num < mb) {
      result = num / kb
      unit = 'K'
    } else if (num >= mb && num < gb) {
      result = num / mb
      unit = 'M'
    } else if (num >= gb && num < tb) {
      result = num / gb
      unit = 'G'
    } else {
      result = num / tb
      unit = 'T'
    }
    return result.toFixed(2) + unit
  }
}
