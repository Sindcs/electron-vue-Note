/**
 * Created by Sind on 2017/5/14.
 */
import catalogdal from '../dal/catalogdal'
import documentdal from '../dal/documentdal'
import appConfig from '../config/appConfig'
import util from '../common/util'

var enumType = require('../model/enumtype')

export default {
  // 根据uuid获取catalog的信息
  getOneCataLogInfo: (uuid) => {
    return new Promise((resolve, reject) => {
      catalogdal.getOne(uuid, (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  },
  // 根据uuid获取catalog的信息
  getOneCataLogAllChianInfo: (uuid, item) => {
    return new Promise((resolve, reject) => {
      catalogdal.getOneAllChild(uuid, item, (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  },
  // 获取监控文件夹
  getMonitoredCataLog: () => {
    return new Promise((resolve, reject) => {
      catalogdal.getMonitoredCataLog((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  // 获取某个类型下的目录
  getCatalogByType: (type) => {
    return new Promise((resolve, reject) => {
      catalogdal.getByType(type, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  // 获取某个目录下的资源数
  getOneCataLogSourseCount: (uuid) => {
    return new Promise((resolve, reject) => {
      documentdal.getCountByCataLogId(uuid, (num) => {
        if (num) {
          resolve(num)
        } else {
          reject(null)
        }
      })
    })
  },
  // 获取某个目录下的所有子目录
  getOneAllChild: (uuid, isGetMoniter) => {
    return new Promise((resolve, reject) => {
      catalogdal.getOneAllChild(uuid, isGetMoniter, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  },
  // 插入或更新目录
  insertOrUpdateCataLog: (uuid, cataLog) => {
    return new Promise((resolve, reject) => {
      catalogdal.getOne(uuid, (err, rs) => {
        if (err) {
          reject(err)
        }
        if (rs) {
          catalogdal.updateName(uuid, cataLog.name, 0, (err) => {
            if (err) {
              reject(err)
            }
            resolve('update')
          })
        } else {
          catalogdal.insert(cataLog, (err) => {
            if (err) {
              reject(err)
            }
            resolve('insert')
          })
        }
      })
    })
  },
  // 添加一个目录
  addCatalog: (cataLog) => {
    cataLog.uuid = util.getUuid()
    return new Promise((resolve, reject) => {
      catalogdal.checkExist(cataLog.name, cataLog.parentCataLogId, (err, row) => {
        if (err) {
          reject(err)
        } else if (row && row.count !== 0) {
          reject(enumType.statusCode.exist)
        } else {
          catalogdal.insert(cataLog, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(cataLog)
            }
          })
        }
      })
    })
  },
  // 删除某一个目录 (callback 状态码) 有待给为promise
  deleteCatalog: (uuid) => {
    return new Promise((resolve, reject) => {
      catalogdal.getOneAllFirstChild(uuid, (innerUuid, rows) => {
        if (rows.length > 0) {
          reject(enumType.statusCode.hasChild)
        } else {
          documentdal.getAllCountByCataLogId(uuid, (ierr, count) => {
            if (ierr) {
              reject(ierr)
            }
            if (count && count > 0) {
              reject(enumType.statusCode.hasChild)
            } else {
              catalogdal.deleteOne(uuid, (err) => {
                if (err) {
                  reject(err)
                } else {
                  appConfig.setDeleteInfo({
                    deleteSourceType: enumType.deleteSourceType.cataLog,
                    uuid: uuid
                  })
                  resolve()
                }
              })
            }
          })
        }
      })
    })
  },
  // 删除同步时的目录
  deleteOneCataLogSync: (uuid) => {
    return new Promise((resolve, reject) => {
      catalogdal.deleteOne(uuid, (err) => {
        if (err) {
          reject(err)
        }
        resolve('delete')
      })
    })
  },
  // 更改目录名称
  updateCatalog: (uuid, name, parentCataLogId) => {
    return new Promise((resolve, reject) => {
      catalogdal.checkExist(name, parentCataLogId, (err, row) => {
        if (err) {
          reject(err)
        } else if (row && row.count !== 0) {
          reject(enumType.statusCode.exist)
        } else {
          catalogdal.updateName(uuid, name, 1, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(uuid)
            }
          })
        }
      })
    })
  },
  // 获取发生更新的目录
  getHasChangedCataLogs: () => {
    return new Promise((resolve, reject) => {
      catalogdal.getHasChangedCataLogs((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  },
  // 重置更新状态
  resetIsChanged: (uuid) => {
    return new Promise((resolve, reject) => {
      catalogdal.resetIsChanged(uuid, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  },
  // 获取所有目录uuid集合
  getAllUuids: () => {
    return new Promise((resolve, reject) => {
      catalogdal.getAllUuids((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res.map(val => {
          return val.uuid
        }))
      })
    })
  },
  // 通过目录Id获取目录路径
  getCataLogPathByCataLogChain: function (cataLogIdList) {
    return new Promise((resolve, reject) => {
      if (cataLogIdList.length === 0) {
        resolve('')
      }
      catalogdal.getCataLogNameByUuids(cataLogIdList, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          let cataLogNames = rows.map(val => {
            return val.name
          })
          let path = cataLogNames.join('\\')
          resolve(path)
        }
      })
    })
  },
  // 获取子目录数目
  getChildCataLogCount: (cataLogId) => {
    return new Promise((resolve, reject) => {
      catalogdal.getOneChildCount(cataLogId, (err, num) => {
        if (err) {
          reject(err)
        } else {
          resolve(num)
        }
      })
    })
  },
  getCataLogFullPath: function (uuid, baseMap) {
    return new Promise((resolve, reject) => {
      catalogdal.getOne(uuid, (err, rs) => {
        if (err) {
          reject(err)
        } else {
          if (rs) {
            let cataLogChain = `${rs.cataLogChain}/${rs.uuid}`
            let cataLogArray = cataLogChain.split('/')
            let cataLogTypeName = baseMap.get(cataLogChain.split('/')[1])
            this.getCataLogPathByCataLogChain(cataLogArray.slice(2)).then((cataLogPath) => {
              let storePath = ''
              if (cataLogPath) {
                storePath = cataLogTypeName + '\\' + cataLogPath
              } else {
                storePath = cataLogTypeName + '\\' + cataLogPath
              }
              resolve(storePath)
            })
          } else {
            reject(enumType.statusCode.notExist)
          }
        }
      })
    })
  },
  resetAllIsChanged: () => {
    return new Promise((resolve, reject) => {
      catalogdal.resetAllIsChanged(1, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  // 更改目录父目录
  /*
   * cataLogId : 被更改目录id
   * parentId: 被更改目录【更改后】的父目录Id
   * */
  changCataLogParentId: (cataLogId, parentId, catalogChain) => {
    return new Promise((resolve, reject) => {
      catalogdal.changCataLogParentId(cataLogId, parentId, catalogChain, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  // 更改目录顺序
  /*
  * cataLogId : 被更改目录id
  * frontOrderId: 被更改目录【更改后】的前一个目录的orderId
  * backOrderId: 被更改目录【更改后】的后一个目录的orderId
  * */
  changCataLogOrderId: (cataLogId, frontOrderId, backOrderId) => {
    return new Promise((resolve, reject) => {
      catalogdal.changCataLogOrder(cataLogId, frontOrderId, backOrderId, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
