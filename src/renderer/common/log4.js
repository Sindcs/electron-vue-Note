/**
 * Created by Sind on 2017/3/24.
 * the sys Log
 */
const log4js = require('log4js')
const fs = require('fs')
const path = require('path')

var Log = function () {
  // 加载配置文件
  var objConfig = JSON.parse(fs.readFileSync('config/log4js.json', 'utf8'))
  // 判断日志目录是否存在，不存在时创建日志目录
  function checkAndCreateDir (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }
// 检查配置文件所需的目录是否存在，不存在时创建
  if (objConfig.appenders) {
    var baseDir = path.join(process.cwd(), objConfig.customBaseDir)
    checkAndCreateDir(baseDir)
    var defaultAtt = objConfig.customDefaultAtt
    for (var i = 0, j = objConfig.appenders.length; i < j; i++) {
      var item = objConfig.appenders[i]
      if (item['type'] === 'console') {
        continue
      }
      if (defaultAtt !== null) {
        for (var att in defaultAtt) {
          if (item[att] == null) {
            item[att] = defaultAtt[att]
          }
        }
      }
      if (baseDir != null) {
        if (item['filename'] == null) {
          item['filename'] = baseDir
        } else {
          item['filename'] = baseDir + item['filename']
        }
      }
      var fileName = item['filename']
      if (fileName === null) {
        continue
      }
      var pattern = item['pattern']
      if (pattern !== null) {
        fileName += pattern
      }
      var dir = path.dirname(fileName)
      checkAndCreateDir(dir)
    }
    // 目录创建完毕，才加载配置，不然会出异常
    log4js.configure(objConfig)
    this.logDebug = log4js.getLogger('logDebug')
    this.logInfo = log4js.getLogger('logInfo')
    this.logWarn = log4js.getLogger('logWarn')
    this.logErr = log4js.getLogger('logErr')
  }
}

Log.prototype.writeDebug = function (msg) {
  if (msg === null) {
    msg = ''
  }
  this.logDebug.debug(msg)
}

Log.prototype.writeInfo = function (msg) {
  if (msg === null) {
    msg = ''
  }
  this.logInfo.info(msg)
}

Log.prototype.writeWarn = function (msg) {
  if (msg === null) {
    msg = ''
  }
  this.logWarn.warn(msg)
}

Log.prototype.writeErr = function (msg, exp) {
  if (msg === null) {
    msg = ''
  }
  if (exp != null) {
    msg += '\r\n' + exp
  }
  this.logErr.error(msg)
}

module.exports = Log
