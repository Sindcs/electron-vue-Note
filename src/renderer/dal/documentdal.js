/**
 * 文档
 */
import nedbs from '../foundation/nedb'
import log from '../foundation/log'
import util from '../common/util'
import {cataLogType} from '../model/enumtype'

const nedb = nedbs.nedb

export default {
  // 分页获取某一类型下的资源
  getPageByType: (type, pageIndex, pageSize, callback) => {
    nedb.find({ type: type })
      .projection({ content: 0, _id: 0 })
      .sort({ dateCreated: -1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPageByType ${err}`
          console.log(str)
          log.writeErr(str)
          callback(null)
        } else {
          callback(docs)
        }
      })
  },
  getUuidsByCataLogId: (cataLogId, cataLogType, callback) => {
    let filter = {
    }
    if (cataLogId) {
      filter.cataLogId = cataLogId
    }
    if (cataLogType) {
      filter.cataLogType = cataLogType
    }
    nedb.find(filter)
      .projection({ uuid: 1 })
      .exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPageByType ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },
  getOneByPath: (path, cataLogId, callback) => {
    nedb.find({filePath: path, cataLogId: cataLogId})
      .projection({ content: 0 })
      .exec((err, docs) => {
        if (err) {
          let str = `FAIL on getOneByPath ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },
  // 获取某一类型下的资源数目
  getCountByType: (type, callback) => {
    nedb.count({ type: type }, (err, count) => {
      if (err) {
        let str = `FAIL on getCountByType ${err}`
        console.log(str)
        log.writeErr(str)
        callback(null)
      } else {
        callback(count)
      }
    })
  },
  // 获取某一目录下文档数目（不包含回收站）
  getCountByCataLogId: (cataLogId, query, callback) => {
    let filter = {
      isdroped: 0,
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { abstracts: { $regex: new RegExp(query, 'i') } }
      ] }
    if (cataLogId) {
      filter.cataLogId = cataLogId
    }
    nedb.count(filter, (err, count) => {
      if (err) {
        let str = `FAIL on getCountByCataLogId ${err}`
        console.log(str)
        log.writeErr(str)
        callback(err, null)
      } else {
        callback(null, count)
      }
    })
  },
  // 获取某一目录下文档数目（不包含回收站）
  getAllCountByCataLogId: (cataLogId, callback) => {
    nedb.count({ cataLogId: cataLogId, isdroped: 0 }, (err, count) => {
      if (err) {
        let str = `FAIL on getCountByCataLogId ${err}`
        console.log(str)
        log.writeErr(str)
        callback(err, null)
      } else {
        callback(null, count)
      }
    })
  },
  getAllCountByType: (type, callback) => {
    nedb.count({ cataLogType: type, isdroped: 0 }, (err, count) => {
      if (err) {
        let str = `FAIL on getAllCountByType ${err}`
        console.log(str)
        log.writeErr(str)
        callback(err, null)
      } else {
        callback(null, count)
      }
    })
  },
  getQueryFilters: (queryParams) => {
    let filter = {
      isdroped: 0
    }
    if (queryParams) {
      // 标题、作者、关键字、摘要
      if (queryParams.query) {
        filter.$or = []
        filter.$or.push(
          ...[
            { title: { $regex: new RegExp(queryParams.query, 'i') } },
            { abstracts: { $regex: new RegExp(queryParams.query, 'i') } },
            { author: { $regex: new RegExp(queryParams.query, 'i') } }
          ]
        )
      }
      if (queryParams.uuids) {
        if (queryParams.orUuids) {
          filter.uuid = {$in: util.arrayIntersection(queryParams.uuids, queryParams.orUuids)}
        } else {
          filter.uuid = {$in: queryParams.uuids}
        }
      } else if (queryParams.orUuids) {
        if (filter.$or) {
          filter.$or.push({uuid: {$in: queryParams.orUuids}})
        } else {
          filter.$or = [{uuid: {$in: queryParams.orUuids}}]
        }
      }
      // 是否发生了更改
      if (queryParams.isChanged || queryParams.isChanged === 0) {
        filter.isChanged = queryParams.isChanged
      }
      // 是否同步了文件
      if (queryParams.isSyncFile || queryParams.isSyncFile === 0) {
        filter.isSyncFile = queryParams.isSyncFile
      }
      // 是否上传了文件
      if (queryParams.isUpFile || queryParams.isUpFile === 0) {
        filter.isUpFile = queryParams.isUpFile
      }
      // 目录类型（笔记、文献、文档）
      if (queryParams.cataLogType) {
        filter.cataLogType = queryParams.cataLogType
      }
      // 论文类型
      if (queryParams.lietratureType) {
        filter.lietratureType = queryParams.lietratureType
      }
      // 文档类型
      if (queryParams.documentType) {
        filter.documentType = queryParams.documentType
      }
      // 是否中间层提取
      if (queryParams.isFromMiddle || queryParams.isFromMiddle === 0) {
        filter.isFromMiddle = queryParams.isFromMiddle
      }
      // 是否来自中间层
      if (queryParams.language) {
        filter.language = queryParams.language
      }
      if (queryParams.remark) {
        filter.remark = queryParams.remark
      }
      // 是否为监控文件
      if (queryParams.isMonitored || queryParams.isMonitored === 0) {
        filter.isMonitored = queryParams.isMonitored
      }
      // 是否提取失败
      if (queryParams.isAnalysisFalse || queryParams.isAnalysisFalse === 0) {
        filter.isAnalysisFalse = queryParams.isAnalysisFalse
      }
      // 刊名
      if (queryParams.periodicalName) {
        filter.periodicalName = queryParams.periodicalName
      }
      // 记录创建时间
      if (queryParams.dateInputStart && queryParams.dateInputEnd) {
        filter.inputTime = {$gte: queryParams.dateInputStart, $lte: queryParams.dateInputEnd}
      }
      // 文件创建时间
      if (queryParams.dateCreatStart && queryParams.dateCreatEnd) {
        filter.dateCreated = {$gte: queryParams.dateCreatStart, $lte: queryParams.dateCreatEnd}
      }
    }
    return filter
  },
  // 分页获取某一目录下的资源
  getPageByCataLogId: function (cataLogId, type, pageIndex, pageSize, query, callback) {
    let filter = {}
    let sort = { inputTime: -1 }
    if (type) {
      if (type === cataLogType.personalNote) {
        sort = { dateUpdated: -1 }
      }
    }
    if (Object.prototype.toString.call(query) === '[object String]') {
      filter = this.getQueryFilters({
        query: query
      })
    } else {
      filter = this.getQueryFilters(query)
      if (query && query.$sort) {
        sort = query.$sort
      }
    }
    if (cataLogId) {
      filter.cataLogId = cataLogId
    }
    if (type) {
      filter.cataLogType = type
    }
    nedb.find(filter)
      .projection({ content: 0, _id: 0 })
      .sort(sort)
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPageByCataLogId ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          nedb.count(filter)
            .exec((err, count) => {
              if (err) {
                let str = `FAIL on getPageByCataLogId ${err}`
                console.log(str)
                log.writeErr(str)
                callback(err, null)
              } else {
                callback(null, {
                  docs: docs,
                  totalCount: count
                })
              }
            })
        }
      })
  },

  // 取某一目录下的资源(排除uuids)
  getByCataLogIdExceputUuids: (cataLogId, cataLogType, uuids, pageIndex, pageSize, query, callback) => {
    let filter = { cataLogType: cataLogType, isdroped: 0, uuid: {$nin: uuids}, title: { $regex: new RegExp(query, 'i') } }
    if (cataLogId) {
      filter.cataLogId = cataLogId
    }
    nedb.find(filter)
      .projection({ content: 0, _id: 0 })
      .sort({ inputTime: -1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPageByCataLogId ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },

  // 分页获取某一目录下的标题或摘要包含【关键字】
  queryDocmentByCataLogId: function (cataLogId, query, pageIndex, pageSize, callback) {
    let filter = {}
    let sort = { inputTime: -1 }
    if (Object.prototype.toString.call(query) === '[object String]') {
      filter = this.getQueryFilters({
        query: query
      })
    } else {
      filter = this.getQueryFilters(query)
      if (query && query.$sort) {
        sort = query.$sort
      }
    }
    if (cataLogId) {
      filter.cataLogId = cataLogId
    }
    nedb.find(filter)
      .projection({ content: 0, _id: 0 })
      .sort(sort)
      .skip(pageIndex * pageSize)
      .limit(pageSize).exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPageByCataLogId ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },

  // 分页获取标题模糊检索【关键字】
  queryDocmentByTitle: (query, pageIndex, pageSize, callback) => {
    let sort = { inputTime: -1 }
    if (query && query.$sort) {
      sort = query.$sort
    }
    nedb.find({
      title: { $regex: new RegExp(query, 'i') }
    })
      .projection({ content: 0, _id: 0 })
      .sort(sort)
      .skip(pageIndex * pageSize)
      .limit(pageSize).exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPageByCataLogId ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },

  // 分页获取标题模糊检索【关键字】
  queryDocmentByTitleAndContent: function (type, query, pageIndex, pageSize, callback) {
    let filter = {}
    let sort = { inputTime: -1 }
    if (query && query.$sort) {
      sort = query.$sort
    }
    if (Object.prototype.toString.call(query) === '[object String]') {
      filter = this.getQueryFilters({
        query: query
      })
    } else {
      filter = this.getQueryFilters(query)
    }
    if (type !== 'total' && type) {
      filter.cataLogType = type
    }
    nedb.find(filter)
      .projection({ content: 0, _id: 0 })
      .sort(sort)
      .skip(pageIndex * pageSize)
      .limit(pageSize).exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPageByCataLogId ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },

  // 分页获取多个uuid下的标题或摘要包含【关键字】
  getDocmentByUUids: (uuids, pageIndex, pageSize, callback) => {
    nedb.find({ uuid: { $in: uuids } })
      .projection({ content: 0, _id: 0 })
      .sort({ inputTime: -1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize).exec((err, docs) => {
        if (err) {
          let str = `FAIL on getDocmentByUUids ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },

  // 获取多个uuid下的标题或摘要包含【关键字】(不排序)
  getDocmentByUUidsUnSort: function (paramUuids, query, callback) {
    let filter = {}
    let uuidss = []
    if (query) {
      uuidss = query.uuids
    }
    let uuids = util.arrayIntersection(uuidss, paramUuids)
    if (Object.prototype.toString.call(query) === '[object String]') {
      filter = this.getQueryFilters({
        query: query
      })
      if (uuids) {
        filter.uuid = {$in: uuids}
      }
    } else {
      if (uuids) {
        if (query) {
          query.uuids = uuids
        } else {
          query = { uuids: uuids }
        }
      }
      filter = this.getQueryFilters(query)
    }
    nedb.find(filter)
      .projection({ content: 0, _id: 0 })
      .exec((err, docs) => {
        if (err) {
          let str = `FAIL on getDocmentByUUids ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },
  // 分页获取垃圾箱资源
  getPageByRecycle: function (pageIndex, pageSize, cataLogType, query, callback) {
    let filter = {}
    let sort = { inputTime: -1 }
    if (query && query.$sort) {
      sort = query.$sort
    }
    if (Object.prototype.toString.call(query) === '[object String]') {
      filter = this.getQueryFilters({
        query: query
      })
    } else {
      filter = this.getQueryFilters(query)
    }
    if (cataLogType) {
      filter.cataLogType = cataLogType
    }
    filter.isdroped = 1
    nedb.find(filter)
      .projection({ content: 0, _id: 0 })
      .sort(sort)
      .skip(pageIndex * pageSize)
      .limit(pageSize).exec((err, docs) => {
        if (err) {
          let str = `FAIL on getPage ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },
  // 获取某一个资源内容
  getOneWithOutContent: (uuid, callback) => {
    nedb.findOne({ uuid: uuid })
      .projection({ content: 0, _id: 0 })
      .exec((err, doc) => {
        if (err) {
          let str = `FAIL on getOneContent ${err}`
          console.log(str)
          log.writeErr(str)
          callback(null)
        } else {
          callback(doc)
        }
      })
  },
  // 插入数据，可以是多条
  insert: (docs, callback) => {
    nedb.insert(docs, (err, newDocs) => {
      if (err) {
        let str = `FAIL on insert doc ${err}`
        console.log(str)
        log.writeErr(str)
        callback(err, null)
      } else {
        callback(null, newDocs)
      }
    })
  },
  // 删除一条记录
  delete: (uuid, callback) => {
    nedb.remove({ uuid: uuid }, { multi: true }, (err, numRemoved) => {
      if (err) {
        let str = `FAIL on delete doc ${err}`
        console.log(str)
        log.writeErr(str)
        callback(null)
      } else {
        callback(numRemoved)
      }
    })
  },
  // 删除一系列文档
  deleteAllIds: (uuids, callback) => {
    nedb.remove({ uuid: { $in: uuids } }, { multi: true }, (err, numRemoved) => {
      if (err) {
        let str = `FAIL on deleteAllIds doc ${err}`
        console.log(str)
        log.writeErr(str)
        callback(err, null)
      } else {
        callback(null, numRemoved)
      }
    })
  },
  // 删除一系列文档
  deleteaByCataLogId: (cataLogId, callback) => {
    nedb.remove({ cataLogId: cataLogId }, { multi: true }, (err, numRemoved) => {
      if (err) {
        let str = `FAIL on deleteAllIds doc ${err}`
        console.log(str)
        log.writeErr(str)
        callback(err, null)
      } else {
        callback(null, numRemoved)
      }
    })
  },
  // 清空回收站
  deleteAllRecycleBin: (callback) => {
    nedb.remove({ isdroped: 1 }, { multi: true }, (err, num) => {
      if (err) {
        callback(err, num)
      } else {
        callback(num, null)
      }
    })
  },
  // 更新isDorped字段
  updateIsDrop: (uuids, isDrop, callback) => {
    nedb.update({ uuid: { $in: uuids } }, { $set: { isdroped: isDrop, isChanged: 1 } }, { multi: true }, (err, numReplaces) => {
      if (err) {
        let str = `FAIL on updateIsDrop doc ${err}`
        console.log(str)
        log.writeErr(str)
        callback(err, null)
      } else {
        callback(null, numReplaces)
      }
    })
  },
  // 更新文档
  update: (uuid, doc, callback) => {
    if (!doc.cataLogId) {
      callback('null catalogid')
    } else {
      if (doc._id) {
        delete doc._id
      }
      // doc.dateUpdated = Date.now()
      nedb.update({ uuid: uuid }, { $set: doc }, { multi: true }, (err, num) => {
        if (err) {
          let str = `FAIL on updateIsDrop doc ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, num)
        }
      })
    }
  },
  dropAll: (isDrop, callback) => {
    nedb.update({isdroped: 1}, {$set: {isdroped: isDrop, isChanged: 1}}, { multi: true }, (err, num) => {
      if (err) {
        console.log(err)
        callback(err, null)
      }
      if (num) {
        callback(null, num)
      }
    })
  },
  // 获取发生更改的文档(排除监控文件)
  getHasChangedDocs: (callback) => {
    nedb.find({isChanged: 1, isMonitored: 0})
      .projection({ content: 0, _id: 0 })
      .exec((err, docs) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },

  // 获取文档下载失败的文档(排除监控文件)
  getFileNotDownloadDocs: (type, macCode, callback) => {
    nedb.find({
      isMonitored: 0,
      isSyncFile: 0,
      isUpFile: 1,
      isChanged: 0,
      cataLogType: {$ne: type}
    }).projection({ content: 0, _id: 0 })
      .exec((err, docs) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },
  // 获取没有上传的文档(排除监控文件)
  getFileNotUpLoadDocs: (type, macCode, callback) => {
    nedb.find({
      isMonitored: 0,
      isUpFile: 0,
      isChanged: 0,
      macCode: macCode,
      cataLogType: {$ne: type}
    }).projection({ content: 0, _id: 0 })
      .exec((err, docs) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },
  // 重置更改状态
  resetIsChanged: (uuid, callback) => {
    nedb.update({uuid: uuid}, {$set: {isChanged: 0}}, { multi: true }, (err, num) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, num)
      }
    })
  },
  resetAllIsChanged: (value, callback) => {
    nedb.update({}, {$set: {isChanged: value}}, { multi: true }, (err, num) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, num)
      }
    })
  },
  // 检查是否存在
  checkExist: (uuid, callback) => {
    nedb.find({uuid: uuid}).exec((err, rs) => {
      if (err) {
        callback(err)
      } else {
        callback(null, rs)
      }
    })
  },
  // 多条件查询
  queryDocByMultipleCondition: function (query, pageIndex, pageSize, callback) {
    let filter = {}
    let sort = { inputTime: -1 }
    if (query && query.$sort) {
      sort = query.$sort
    }
    filter = this.getQueryFilters(query)
    nedb.find(filter)
      .projection({ content: 0, _id: 0 })
      .sort(sort)
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .exec((err, docs) => {
        if (err) {
          let str = `FAIL on getDocmentByUUids ${err}`
          console.log(str)
          log.writeErr(str)
          callback(err, null)
        } else {
          callback(null, docs)
        }
      })
  },
  // 获取所有数据
  getAll: (callback) => {
    nedb.find({}).exec((err, rs) => {
      if (err) {
        console.log(err)
        callback(err)
      } else {
        callback(null, rs)
      }
    })
  },
  getAllCount: (callback) => {
    nedb.count({}).exec((err, count) => {
      if (err) {
        console.log(err)
        callback(err)
      } else {
        callback(null, count)
      }
    })
  }
}
