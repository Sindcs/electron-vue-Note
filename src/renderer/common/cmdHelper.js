import config from '../config/index'
import util from '../common/util'

var execFile = require('child_process').execFile
var exec = require('child_process').exec
var execSync = require('child_process').execSync
var fs = require('fs')

export default {
  // 把pdf转换为xml
  pdfToXml: (sourceFullPath, destinationPath, startPage, endPage) => {
    return new Promise((resolve, reject) => {
      let destinationFullPath = `${sourceFullPath}.xml`
      if (destinationPath !== null) {
        destinationFullPath = `${destinationPath}\\${util.getFileName(sourceFullPath)}.xml`
      }
      execFile(config.toolPath.pdfToXml, [ '-blocks', '-noImageInline', '-fullFontName', '-noImage', '-f', `${startPage}`, '-l', `${endPage}`, sourceFullPath, destinationFullPath ], (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          resolve(destinationFullPath)
        }
      })
    })
  },
  // 整体替换
  updateCmd: (sourceFullPath, destinationPath) => {
    return new Promise((resolve, reject) => {
      execFile(config.toolPath.updateTool.name, [ 'extract', sourceFullPath, destinationPath, `${config.toolName}.exe` ], (err, stdout) => {
        if (err) {
          reject(err)
        } else {
          resolve(stdout)
        }
      })
    })
  },
  // 部分更新
  updateWinForm: (sourceFullPath, destinationPath) => {
    return new Promise((resolve, reject) => {
      fs.writeFileSync(config.toolPath.updateTool.ini, `${sourceFullPath}\r\n${destinationPath}\r\n${config.toolName}.exe`, {flag: 'w'})
      exec(config.toolPath.updateTool.name, (err, stdout) => {
        if (err) {
          reject(err)
        } else {
          resolve(stdout)
        }
      })
    })
  },
  getUniqueId: (sourceFullPath) => {
    return new Promise((resolve, reject) => {
      execFile(config.toolPath.sunique, [ sourceFullPath ], (err, stdout, stderr) => {
        if (err || stderr) {
          console.log(stderr)
          reject(err)
        } else {
          if (stdout.indexOf('[result]') >= 0) {
            let array = stdout.split(' ')
            resolve({
              uniqueId: array[1],
              size: array[2]
            })
          }
        }
      })
    })
  },
  // 执行cmd命令
  execCmd: (cmdStr) => {
    return new Promise((resolve, reject) => {
      exec(cmdStr, function (err, stdout, stderr) {
        if (err) {
          reject(err)
          console.log(`execCmd ${cmdStr} error:${stderr}`)
        } else {
          resolve(stdout)
        }
      })
    })
  },
  // 同步执行cmd命令
  execSyncCmd: (cmdStr) => {
    return new Promise((resolve, reject) => {
      try {
        execSync(cmdStr)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },
  // 定位
  gotoDirection: function (path) {
    return new Promise((resolve, reject) => {
      fs.exists(path, (exists) => {
        if (exists) {
          this.execCmd(`Explorer.exe /select,${path}`).then(() => {
            resolve()
          }).catch(err => {
            console.log(err)
            resolve()
          })
        } else {
          reject()
        }
      })
    })
  },
  // 为一个文件夹更换图标
  setIcon: function (direction, iconPath) {
    let iniFile = `${direction}\\desktop.ini`
    let mes = `[.ShellClassInfo]
IconFile=${iconPath}`
    fs.exists(iniFile, (exists) => {
      if (exists) {
        fs.appendFile(iniFile, mes, (err) => {
          if (!err) {
            exec(`attrib +s ${direction}`)
          }
        })
      } else {
        fs.writeFile(iniFile, mes, (err) => {
          if (!err) {
            exec(`attrib +s ${direction}`)
          }
        })
      }
    })
  }
}
