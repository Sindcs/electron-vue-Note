import { ipcRenderer, remote } from 'electron'
import config from '../config/index'
import nedbs from '../foundation/nedb'
import dt from '../business/importAndExport/dt'
import evenote from '../business/importAndExport/evenote'
import documentOperatore from '../business/documentOperatore'

var nedb = nedbs.nedb
var idInfo = {
}

ipcRenderer.on('getMainHandle-response', (event, arg) => {
  config.mainWindowHandle = arg.mainHandel.readUInt32LE(0)
  idInfo.main = arg.mainId
  idInfo.worker = arg.workerId
})
ipcRenderer.send('getMainHandle-request', '')

export default {
  newMessage: () => {
    ipcRenderer.send('newMessage-request', '')
  },
  backWorker: (operatore) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.on('backworker-response', (event, result) => {
        if (result.error) {
          reject(result.error)
        } else {
          resolve(result)
        }
      })
      ipcRenderer.send('backworker-request', operatore)
    })
  },
  analysisFile: (params) => {
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.once(`analysisFile-response-${params.cataLogInfo.uuid}`, (event, result) => {
          if (result.error) {
            reject(result.error)
          } else {
            resolve(result)
          }
        })
        remote.BrowserWindow.fromId(idInfo.worker).webContents.send('analysisFile-request', {fromId: idInfo.main, data: params})
      } catch (err) {
        reject(err)
      }
    })
  },
  analysisArrayData: (params) => {
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.on('analysisArrayData-response', (event, result) => {
          if (result.error) {
            reject(result.error)
          } else {
            resolve(result)
          }
        })
        remote.BrowserWindow.fromId(idInfo.worker).webContents.send('analysisArrayData-request', {fromId: idInfo.main, data: params})
      } catch (err) {
        reject(err)
      }
    })
  },
  importEnex: (params) => {
    params.mac = config.mac
    return new Promise(async (resolve, reject) => {
      try {
        if (params.isFromIpc) {
          ipcRenderer.on('importEnex-response', (event, result) => {
            if (result.error) {
              reject(result.error)
            } else {
              resolve(result)
            }
            nedb.loadDatabase()
          })
          remote.BrowserWindow.fromId(idInfo.worker).webContents.send('importEnex-request', {fromId: idInfo.main, data: params})
        } else {
          await evenote.importFromEnex(params.fileFullPath, params.cataLogId, params.mac).then((result) => {
            resolve(result)
          }).catch(err => {
            reject(err)
          })
        }
      } catch (err) {
        reject(err)
      }
    })
  },
  importSprk: (params) => {
    params.mac = config.mac
    return new Promise((resolve, reject) => {
      try {
        if (params.isFromIpc) {
          ipcRenderer.on('importSprk-response', (event, result) => {
            if (result.error) {
              reject(result.error)
            } else {
              resolve(result)
            }
            nedb.loadDatabase()
          })
          remote.BrowserWindow.fromId(idInfo.worker).webContents.send('importSprk-request', {fromId: idInfo.main, data: params})
        } else {
          dt.importFromSprk(params.fileFullPath, params.cataLogId, params.mac).then((result) => {
            resolve(result)
          }).catch(err => {
            reject(err)
          })
        }
      } catch (err) {
        reject(err)
      }
    })
  },
  analysisContentIndex: (params) => {
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.once(`analysisContentIndex-response-${params.cataLogId}`, async (event, result) => {
          if (result.error) {
            reject(result.error)
          } else {
            await documentOperatore.insertOrUpdateContentIndex(params.uuid, params.cataLogId, `${result.content} ${params.content}`).then(() => {
              resolve(result)
            }).catch(err => {
              reject(err)
            })
          }
        })
        remote.BrowserWindow.fromId(idInfo.worker).webContents.send('analysisContentIndex-request', {fromId: idInfo.main, data: params})
      } catch (err) {
        reject(err)
      }
    })
  }
}
