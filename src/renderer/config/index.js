// 下面处理使得可以被render与main同时调用

import userOperatore from '../business/userOperatore'

var app = {}
var remote = require('electron').remote
var path = require('path')
if (remote) {
  app = remote.app
} else {
  app = require('electron').app
}
let hostPath = process.cwd()
let electronPath = 'node_modules\\electron-prebuilt\\dist\\electron.exe'
let backworkerPath = 'app\\dist\\backworker.js'
if (process.env.NODE_ENV !== 'development') {
  hostPath = process.cwd() + '\\resources'
  electronPath = path.resolve('ksnstool.exe')
  backworkerPath = path.resolve('resources\\dist\\backworker.js')
}
let ecpuserName = userOperatore.getECPUserName()

console.log('app data path: ' + app.getPath('userData'))
export default {
  dbConnct: {
    mySql: {
      host: '',
      user: '',
      password: '',
      database: ''
    }
  },
  dbPath: {
    nedb: path.join(app.getPath('userData'), 'dataBase', `docdb_${ecpuserName}.exb`),
    linvodb: path.join(app.getPath('userData'), 'dataBase', `docdb_${ecpuserName}.db`),
    sqlite: path.join(app.getPath('userData'), 'dataBase', `resdb_${ecpuserName}.exb`),
    localstorage: path.join(app.getPath('userData'), ecpuserName)
  },
  hostPath: hostPath,
  childProcess: {
    electronPath: electronPath,
    backworkerPath: backworkerPath
  },
  toolName: 'Dt',
  userDataPath: app.getPath('userData'),
  mac: '',
  os: '',
  macIndex: 0,
  isEnviromentReady: false,
  isNedbReady: false,
  mainWindowHandle: 0,
  maxNum: 1000000,
  indexPath: '',
  accessToken: '',
  tempPath: {
    pdf: app.getPath('userData') + '\\tempPdf',
    image: path.join(hostPath, 'tempImage'),
    dbPath: path.join(app.getPath('userData'), 'dataBase'),
    downloadPath: path.join(app.getPath('userData'), 'download')
  }
}
