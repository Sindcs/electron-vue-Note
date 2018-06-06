/**
 * Created by Sind on 2017/4/28.
 * 文档操作类
 */
import documentdal from '../dal/documentdal'
import sqlite from '../foundation/sqlitdb'
import tagdal from '../dal/tag'
import cataLogOperatore from '../business/cataLogOperatore'
import resouredal from '../dal/resource'
import appConfig from '../config/appConfig'
import tagdocument from '../dal/tag_documentdal'
import config from '../config/index'
import ipcMessage from '../common/ipcMessage'
import renderUtil from '../common/renderutil'
import documentContentIndex from '../dal/documentContentIndex'
import util from '../common/util'
var enumType = require('../model/enumtype')

var db = sqlite.sqliteDb
var path = require('path')
var fs = require('fs')

export default {
    formatTagQueryUuids: (queryParam) => {
        let param = util.deepClone(queryParam)
        return new Promise((resolve, reject) => {
          if (param !== undefined && param.tagInfo) {
            let uuids = [param.tagInfo.uuid]
            tagdocument.getTagsDocuments(uuids, (err, tagDocs) => {
              if (err) {
                reject(err)
              } else {
                param.uuids = tagDocs.map(m => {
                  return m.documentId
                })
                documentContentIndex.getMatchUUids(param.query, param.cataLogId, (err, rows) => {
                  if (err) {
                    reject(err)
                  } else {
                    if (rows) {
                      // param.query = ''
                      let uuids = rows.map(m => {
                        return m.uuid
                      })
                      param.orUuids = uuids.length ? uuids : null
                    }
                    resolve(param)
                  }
                })
              }
            })
          } else {
            if (param) {
              documentContentIndex.getMatchUUids(param.query, param.cataLogId, (err, rows) => {
                if (err) {
                  reject(err)
                } else {
                  if (rows) {
                    // param.query = ''
                    let uuids = rows.map(m => {
                      return m.uuid
                    })
                    param.orUuids = uuids.length ? uuids : null
                  }
                }
                resolve(param)
              })
            } else {
              resolve(param)
            }
          }
        })
    },
    insertOrUpdateContentIndex: (uuid, cataLogId, content) => {
      return new Promise((resolve, reject) => {
        documentContentIndex.findOne(uuid, (err, count) => {
          if (err) {
            reject(err)
          } else {
            if (count) {
              documentContentIndex.update(content, uuid, cataLogId, (err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve({})
                }
              })
            } else {
              documentContentIndex.insert(uuid, content, cataLogId, (err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve({})
                }
              })
            }
          }
        })
      })
    },
    addOneTag: (uuid, name) => {
      let tag = {name: name}
      return new Promise((resolve, reject) => {
        try {
          tagdal.getOneByName(name, (err, row) => {
            if (err) {
              reject(err)
            }
            let tagUuid = util.getUuid()
            if (!row) {
              tag.uuid = tagUuid
              tagdal.insert(tag, (err) => {
                if (err) {
                  reject(err)
                } else {
                  tagdocument.add(uuid, tagUuid, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      resolve(tag)
                    }
                  })
                }
              })
            } else {
              tagdocument.getOneRelation(uuid, row.uuid, (err, count) => {
                if (err) {
                  reject(err)
                } else {
                  if (count === 0) {
                    tagdocument.add(uuid, row.uuid, (err) => {
                      if (err) {
                        reject(err)
                      } else {
                        resolve(row)
                      }
                    })
                  } else {
                    resolve()
                  }
                }
              })
            }
          })
        } catch (err) {
          reject(err)
        }
      })
    },
    // 删除一个标签关系
    deleteOneTag: (uuid, tagId) => {
      return new Promise((resolve, reject) => {
        tagdocument.delete(uuid, tagId, (err, row) => {
          if (err) {
            reject(err)
          } else {
            if (row) {
              appConfig.setDeleteInfo({
                deleteSourceType: enumType.deleteSourceType.tagDocumentRelation,
                uuid: row.uuid
              })
            }
            resolve(1)
          }
        })
      })
    },
    // 彻底删除所有id的文档
  deleteAllIds: (uuids, isMonitored) => {
    return new Promise((resolve, reject) => {
      db.serialize(function () {
        let inStr = util.formatArrayToInStr(uuids)
        db.run('BEGIN')
        db.run(`DELETE FROM documentcontent
        WHERE uuid in ${inStr}`,
          [],
          (err) => {
            if (err) {
              db.run('ROLLBACK')
              reject(err)
            } else {
              documentdal.deleteAllIds(uuids, (err, num) => {
                if (err) {
                  db.run('ROLLBACK')
                  reject(err)
                } else {
                  db.run(`DELETE FROM document_document WHERE documentId in ${inStr} or rdocumentId in ${inStr}`,
                    [],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK')
                        reject(err)
                      } else {
                        db.run(`DELETE FROM favorites WHERE documentId in ${inStr}`,
                          [],
                          (err) => {
                            if (err) {
                              db.run('ROLLBACK')
                              reject(err)
                            } else {
                              db.run(`DELETE FROM resource WHERE ownerId in ${inStr}`,
                                [],
                                (err) => {
                                  if (err) {
                                    db.run('ROLLBACK')
                                    reject(err)
                                  } else {
                                    db.run(`DELETE FROM tag_document WHERE documentId in ${inStr}`,
                                      [],
                                      (err) => {
                                        if (err) {
                                          db.run('ROLLBACK')
                                          reject(err)
                                        } else {
                                          db.run(`DELETE FROM contentIndex WHERE uuid in ${inStr}`,
                                            [],
                                            (err) => {
                                              if (err) {
                                                db.run('ROLLBACK')
                                                reject(err)
                                              } else {
                                                db.run('COMMIT')
                                                currentReadOperatore.clearCurrentReadByUuids(uuids).then().catch(err => {
                                                  console.log(err)
                                                })
                                                if (!isMonitored) {
                                                  uuids.forEach(val => {
                                                    appConfig.setDeleteInfo({
                                                      deleteSourceType: enumType.deleteSourceType.document,
                                                      uuid: val
                                                    })
                                                  })
                                                }
                                                resolve()
                                              }
                                            })
                                        }
                                      })
                                  }
                                })
                            }
                          })
                      }
                    })
                }
              })
            }
          })
      })
    })
  },
  // 删除某个目录下的所有文档
  deleteCatalogAllDocument: (catalogId, isMonitored) => {
    return new Promise((resolve, reject) => {
      documentdal.getUuidsByCataLogId(catalogId, null, async (err, res) => {
        if (err) {
          reject(err)
        } else {
          let uuids = res.map(val => {
            return val.uuid
          })
          if (!uuids.length) {
            resolve()
            return
          }
          db.serialize(function () {
            let inStr = util.formatArrayToInStr(uuids)
            db.run('BEGIN')
            db.run(`DELETE FROM documentcontent
            WHERE uuid in ${inStr}`,
              [],
              (err) => {
                if (err) {
                  db.run('ROLLBACK')
                  reject(err)
                } else {
                  documentdal.deleteaByCataLogId(catalogId, (err, num) => {
                    if (err) {
                      db.run('ROLLBACK')
                      reject(err)
                    } else {
                      db.run(`DELETE FROM document_document WHERE documentId in ${inStr} or rdocumentId in ${inStr}`,
                        [],
                        (err) => {
                          if (err) {
                            db.run('ROLLBACK')
                            reject(err)
                          } else {
                            db.run(`DELETE FROM favorites WHERE documentId in ${inStr}`,
                              [],
                              (err) => {
                                if (err) {
                                  db.run('ROLLBACK')
                                  reject(err)
                                } else {
                                  db.run(`DELETE FROM resource WHERE ownerId in ${inStr}`,
                                    [],
                                    (err) => {
                                      if (err) {
                                        db.run('ROLLBACK')
                                        reject(err)
                                      } else {
                                        db.run(`DELETE FROM tag_document WHERE documentId in ${inStr}`,
                                          [],
                                          (err) => {
                                            if (err) {
                                              db.run('ROLLBACK')
                                              reject(err)
                                            } else {
                                              db.run(`DELETE FROM contentIndex WHERE uuid in ${inStr}`,
                                              [],
                                                (err) => {
                                                  if (err) {
                                                    db.run('ROLLBACK')
                                                    reject(err)
                                                  } else {
                                                    db.run('COMMIT')
                                                    uuids.forEach(val => {
                                                      if (!isMonitored) {
                                                        appConfig.setDeleteInfo({
                                                          deleteSourceType: enumType.deleteSourceType.document,
                                                          uuid: val
                                                        })
                                                      }
                                                    })
                                                    resolve()
                                                  }
                                                })
                                            }
                                          })
                                      }
                                    })
                                }
                              })
                          }
                        })
                    }
                  })
                }
              })
          })
        }
      })
    })
  }
}
