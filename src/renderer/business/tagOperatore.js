import tagdal from '../dal/tag'
import appConfig from '../config/appConfig'

var statuCode = require('../model/enumtype').statusCode
var deleteSourceType = require('../model/enumtype').deleteSourceType

var util = require('../common/util')

export default {
  // 添加一个tag
  addTag: (name) => {
    return new Promise((resolve, reject) => {
      tagdal.getOneByName(name, (err, row) => {
        if (err) {
          reject(err)
        }
        if (!row) {
          let tag = {
            uuid: util.getUuid(),
            name: name
          }
          tagdal.insert(tag, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(tag)
            }
          })
        } else {
          reject(statuCode.exist)
        }
      })
    })
  },
  // 插入或更新标签
  insertOrUpdateOneTag: (uuid, tag) => {
    return new Promise((resolve, reject) => {
      tagdal.getOne(uuid, (err, rs) => {
        if (err) {
          reject(err)
        }
        console.log('tag')
        console.log(rs)
        if (rs) {
          tagdal.update(uuid, tag.name, 0, (err) => {
            if (err) {
              reject(err)
            }
            resolve('update')
          })
        } else {
          tagdal.insert(tag, (err) => {
            if (err) {
              reject(err)
            }
            resolve('insert')
          })
        }
      })
    })
  },
  // 获取所有标签
  getAll: (callback) => {
    tagdal.getAll(callback)
  },
  // 根据名称查询标签
  getByNameQuery: (name) => {
    return new Promise((resolve, reject) => {
      tagdal.getByNameQuery(name, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  },
  // 分页获取标签
  getByPage: (pageSize, pageIndex, callback) => {
    tagdal.getByPage(pageSize, pageIndex, callback)
  },
  // 删除一个标签
  deleteOne: (uuid) => {
    return new Promise((resolve, reject) => {
      tagdal.deleteOne(uuid, (err) => {
        if (err) {
          reject(err)
        } else {
          appConfig.setDeleteInfo({
            deleteSourceType: deleteSourceType.document,
            uuid: uuid
          })
          resolve()
        }
      })
    })
  },
  // 同步服务端删除标签
  deleteOneSync: (uuid) => {
    return new Promise((resolve, reject) => {
      tagdal.deleteOne(uuid, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve('delete')
        }
      })
    })
  },
  // 获取发生更改的标签
  getHasChangedTags: () => {
    return new Promise((resolve, reject) => {
      tagdal.getHasChangedTags((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  },
  // 重置更改状态
  resetIsChanged: (uuid) => {
    return new Promise((resolve, reject) => {
      tagdal.resetIsChanged(uuid, err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  },
  resetAllIsChanged: () => {
    return new Promise((resolve, reject) => {
      tagdal.resetAllIsChanged(1, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
