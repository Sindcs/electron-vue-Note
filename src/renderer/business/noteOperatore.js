/**
 * Created by Sind on 2017/4/27.
 * note
 */
import sqlite from '../foundation/sqlitdb'
import documentdal from '../dal/documentdal'
import tagdal from '../dal/tag'
import tagdocumentdal from '../dal/tag_documentdal'
import cataLogOperator from '../business/cataLogOperatore'
import documentOperatore from '../business/documentOperatore'
import cataLogdal from '../dal/catalogdal'
import imageHelper from '../common/imageHelper'
import resouredal from '../dal/resource'
import config from '../config/index'
import ipcMessage from '../common/ipcMessage'
import renderUtil from '../common/renderutil'
import {cataLogType} from '../model/enumtype'

var db = sqlite.sqliteDb
var util = require('../common/util')
const StringDecoder = require('string_decoder').StringDecoder
const decoder = new StringDecoder('binary')

export default {
  // 添加笔记
  addOneNote: function (note) {
    note.uuid = util.getUuid()
    let time = Date.now()
    note.dateCreated = time
    note.inputTime = time
    note.dateUpdated = time
    note.isdroped = 0
    note.isShared = 0
    note.isDelete = 0
    note.isChanged = 1
    note.mac = config.mac
    note.isMonitored = 0
    note.isUpFile = 1
    note.isSyncFile = 1
    return new Promise((resolve, reject) => {
      try {
        let imageUrlList = util.getHtmlImageList(note.content)
        let maxImageLength = 0
        let imageName = ''
        let imagData
        imageUrlList.forEach(async (val) => {
          if (val.toLowerCase().indexOf(';base64,') < 0) {
            let fileBaseDirection = ''
            if (note.filePath) {
              let fileName = util.getFileName(note.filePath)
              let appendPath = fileName.replace('.' + util.getSuffix(note.filePath), '') + '_files'
              fileBaseDirection = `${util.getDirection(note.filePath)}\\${appendPath}\\`
            }
            imageHelper.convertImage2Binary(val, fileBaseDirection).then(async imagData => {
              if (imagData.length > maxImageLength) {
                maxImageLength = imagData.length
                note.imgSrc = val
              }
              let md5 = util.getMd5(imagData)
              await resouredal.insert({
                uuid: util.getUuid(),
                ownerId: note.uuid,
                mine: util.getFileName(val),
                width: 0,
                height: 0,
                sourceUrl: val,
                size: 0,
                md5: md5,
                data: imagData
              }, (err) => {
                if (err) {
                  console.log(err)
                  // note.falseImages.push(val)
                }
              })
            }).catch((err) => {
              console.log(err)
              // note.falseImages.push(val)
            })
          } else {
            let base64String = val.substring(val.indexOf('base64,') + 7)
            imagData = Buffer.from(base64String, 'base64')
            if (imagData.length > maxImageLength) {
              maxImageLength = imagData.length
              imageName = `${util.getUuid()}.gif`
              note.imgSrc = imageName
            }
          }
        })
        if (note.imgSrc && note.imgSrc === imageName) {
          let md5 = util.getMd5(imagData)
          resouredal.insert({
            uuid: util.getUuid(),
            ownerId: note.uuid,
            mine: imageName,
            width: 0,
            height: 0,
            sourceUrl: imageName,
            size: 0,
            md5: md5,
            data: decoder.write(imagData)
          }, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
        this.insert(note).then(rs => {
          resolve(rs)
        }).catch(err => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  insert: function (note, dbConnection) {
    return new Promise(async (resolve, reject) => {
      let conn = db
      if (dbConnection) {
        conn = dbConnection
      }
      await cataLogOperator.getOneCataLogInfo(note.cataLogId).then(async (rs) => {
        if (rs) {
          note.cataLogType = rs.type
          await conn.serialize(async () => {
            conn.run('BEGIN')
            conn.run(`INSERT INTO documentcontent (uuid, content) 
          values(?,?)`,
              [note.uuid, note.content],
              async (err) => {
                if (err) {
                  conn.run('ROLLBACK')
                  reject(err)
                } else {
                  note.content = util.stripHTML(note.content)
                  note.content = renderUtil.getObjectString(note)
                  await ipcMessage.analysisContentIndex({
                    uuid: note.uuid,
                    cataLogId: note.cataLogId,
                    content: note.content
                  }).then(() => {
                    delete note.content
                    documentdal.insert([ note ], (err, rs) => {
                      if (err) {
                        conn.run('ROLLBACK')
                        reject(err)
                      } else {
                        conn.run('COMMIT')
                        this.getOneNote(rs[0].uuid).then(innerRs => {
                          resolve(innerRs)
                        }).catch(() => {
                          rs[0].content = ''
                          resolve(rs[0])
                        })
                      }
                    })
                  }).catch((err) => {
                    conn.run('ROLLBACK')
                    reject(err)
                  })
                }
              })
          })
        } else {
          reject(`cant't find catalogInfo`)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 更新笔记
  changeNote: function (uuid, doc) {
    doc.isChanged = 1
    // doc.falseImages = []
    return new Promise((resolve, reject) => {
      try {
        let basePath = ''
        if (process.env.NODE_ENV !== 'development') {
          basePath = '..\\..\\'
        }
        resouredal.getAllByOwnerId(uuid, async (err, rows) => {
          if (rows) {
            rows.forEach(val => {
              let locationUrl = `${config.tempPath.image}\\${val.mine}`
              if (doc.content) {
                doc.content = doc.content.replace(locationUrl.replace(config.hostPath + '\\', basePath), val.sourceUrl)
              }
            })
          }
          let imageUrlList = util.getHtmlImageList(doc.content)
          let existImageList = []
          if (rows) {
            try {
              for (let i = 0; i < rows.length; i++) {
                for (let j = 0; j < imageUrlList.length; j++) {
                  if (imageUrlList[j] === rows[i].sourceUrl) {
                    existImageList.push(rows[i])
                    // rows.splice(i, 1)
                  }
                }
              }
              rows.forEach(val => {
                if (existImageList.indexOf(val) < 0) {
                  resouredal.deleteOne(val.uuid, (err) => {
                    if (err) {
                      console.log(err)
                    }
                  })
                }
              })
            } catch (err) {
              console.log(err)
            }
          }
          let maxImageLength = 0
          let imagData = null
          let imageName = ''
          let isBase64 = false
          if (imageUrlList.length !== existImageList.length) {
            for (let k = 0; k < imageUrlList.length; k++) {
              let url = imageUrlList[k]
              if (!existImageList.some((v) => {
                return v.sourceUrl === url
              })) {
                try {
                  if (url.toLowerCase().indexOf(';base64,') < 0) {
                    await imageHelper.convertImage2Binary(url).then(data => {
                      imagData = data
                      if (imagData.length > maxImageLength) {
                        maxImageLength = imagData.length
                        doc.imgSrc = url
                        isBase64 = false
                      }
                      imageName = url
                      if (imagData) {
                        resouredal.insert({
                          uuid: util.getUuid(),
                          ownerId: uuid,
                          mine: util.getFileName(imageName),
                          width: 0,
                          height: 0,
                          sourceUrl: imageName,
                          size: 0,
                          md5: util.getMd5(imagData),
                          data: imagData
                        }, () => {
                          // doc.falseImages.push(url)
                        })
                      }
                    }).catch((err) => {
                      console.log(err)
                      // doc.falseImages.push(url)
                    })
                  } else {
                    let base64String = url.substring(url.indexOf('base64,') + 7)
                    imagData = Buffer.from(base64String, 'base64')
                    if (imagData.length > maxImageLength) {
                      maxImageLength = imagData.length
                      imageName = `${util.getUuid()}.gif`
                      doc.imgSrc = imageName
                      isBase64 = true
                    }
                  }
                } catch (err) {
                  console.log(err)
                }
              }
            }
          }
          try {
            for (let k = 0; k < existImageList.length; k++) {
              let val = existImageList[k]
              if (val.sourceUrl.toLowerCase().indexOf(';base64,') < 0) {
                await imageHelper.convertImage2Binary(val.sourceUrl).then(data => {
                  imagData = data
                  if (imagData.length > maxImageLength) {
                    maxImageLength = imagData.length
                    doc.imgSrc = val.sourceUrl
                    isBase64 = false
                  }
                  imageName = val.sourceUrl
                  if (imagData) {
                    let md5 = util.getMd5(imagData)
                    if (val.md5 !== md5) {
                      resouredal.update(val.uuid, {
                        width: 0,
                        height: 0,
                        sourceUrl: imageName,
                        size: 0,
                        md5: md5,
                        data: imagData
                      }, () => {
                        // doc.falseImages.push(val.sourceUrl)
                      })
                    }
                  }
                }).catch((err) => {
                  console.log(err)
                  // doc.falseImages.push(val.sourceUrl)
                })
              } else {
                let url = val.sourceUrl
                let base64String = url.substring(url.indexOf('base64,') + 7)
                imagData = Buffer.from(base64String, 'base64')
                if (imagData.length > maxImageLength) {
                  maxImageLength = imagData.length
                  imageName = `${util.getUuid()}.gif`
                  isBase64 = true
                  doc.imgSrc = imageName
                }
              }
            }
            // 添加缩略图
            if (doc.imgSrc && isBase64) {
              let md5 = util.getMd5(imagData)
              resouredal.insert({
                uuid: util.getUuid(),
                ownerId: uuid,
                mine: doc.imgSrc,
                width: 0,
                height: 0,
                sourceUrl: doc.imgSrc,
                size: 0,
                md5: md5,
                data: decoder.write(imagData)
              }, (err) => {
                if (err) {
                  console.log(err)
                }
              })
            }
          } catch (err) {
            console.log(err)
          }
          if (err) {
            console.log(err)
          }
          db.serialize(() => {
            db.run('BEGIN')
            db.run(`UPDATE documentcontent SET content = ?  
          WHERE uuid = ?`,
              [doc.content, uuid],
              (err) => {
                if (err) {
                  db.run('ROLLBACK')
                  reject(err)
                } else {
                  doc.content = util.stripHTML(doc.content)
                  let content = renderUtil.getObjectString(doc)
                  ipcMessage.analysisContentIndex({
                    uuid: doc.uuid,
                    cataLogId: doc.cataLogId,
                    content: content
                  }).then(() => {
                    delete doc.content
                    doc.isChanged = 1
                    doc.dateUpdated = Date.now()
                    documentdal.update(uuid, doc, (err, num) => {
                      if (!err) {
                        db.run('COMMIT')
                        this.getOneNote(uuid).then((rs) => {
                          if (rs) {
                            resolve(rs)
                          } else {
                            resolve({})
                          }
                        }).catch(err => {
                          reject(err)
                        })
                      } else {
                        db.run('ROLLBACK')
                        reject(err)
                      }
                    })
                  }).catch((err) => {
                    db.run('ROLLBACK')
                    reject(err)
                  })
                }
              })
          })
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  changTitle: (uuid, title) => {
    return new Promise((resolve, reject) => {
      documentdal.update(uuid, {title: title, isChanged: 1, dateUpdated: Date.now()}, (err, num) => {
        if (err) {
          reject(err)
        } else {
          documentdal.getOneWithOutContent(uuid, (rs) => {
            if (rs) {
              resolve(rs)
            } else {
              resolve({})
            }
          })
        }
      })
    })
  },
  // 查看一个笔记
  getOneNote: (uuid) => {
    return new Promise((resolve, reject) => {
      try {
        let basePath = ''
        if (process.env.NODE_ENV !== 'development') {
          basePath = '..\\..\\'
        }
        documentdal.getOneWithOutContent(uuid, (res) => {
          if (res) {
            db.get(`SELECT content FROM documentcontent WHERE 
            uuid = ?`,
            [uuid],
             function (err, row) {
               if (err) {
                 reject(err)
               }
               if (row) {
                 res.content = row.content
               }
               resouredal.getAllByOwnerId(uuid, (err, rows) => {
                 if (rows) {
                   for (let i = 0; i < rows.length; i++) {
                     let val = rows[i]
                     if (val.mine) {
                       let locationUrl = `${config.tempPath.image}\\${val.mine}`
                       try {
                         imageHelper.convertBinary2Image(val.data, locationUrl)
                       } catch (err) {
                         console.log(err)
                       }
                       if (res.content) {
                         res.content = res.content.replace(val.sourceUrl, locationUrl.replace(config.hostPath + '\\', basePath))
                       }
                     }
                   }
                 }
                 if (err) {
                   console.log(err)
                 }
                 cataLogdal.getOne(res.cataLogId, (err, catalog) => {
                   if (err) {
                     reject(err)
                   }
                   res.cataLogName = catalog.name
                   tagdocumentdal.getOneDocTagRelations(res.uuid, (err, rows) => {
                     if (err) {
                       reject(err)
                     } else {
                       res.tags = rows.map(m => {
                         return m.tagId
                       })
                       tagdal.getAllByUuids(res.tags, (tags) => {
                         if (tags) {
                           res.tags = tags
                         } else {
                           res.tags = []
                         }
                         resolve(res)
                       })
                     }
                   })
                 })
               })
             })
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  // 获取某一目录下的笔记列表 不包含内容
  getByCatalogId: (cataLogId, type, query, pageIndex, pageSize) => {
    return new Promise((resolve, reject) => {
      if (query) {
        query.cataLogId = cataLogId
      } else {
        query = {
          cataLogId
        }
      }
      documentOperatore.formatTagQueryUuids(query).then(queryParam => {
        documentdal.getPageByCataLogId(cataLogId, type, pageIndex, pageSize, queryParam, async (err, rs) => {
          if (err) {
            reject(err)
          } else {
            let res = rs.docs
            let totalCount = rs.totalCount
            if (res && res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                await tagdocumentdal.getOneDocTagRelations(res[i].uuid, (err, rows) => {
                  if (err) {
                    reject(err)
                  } else {
                    res[i].tags = rows.map(m => {
                      return m.tagId
                    })
                    tagdal.getAllByUuids(res[i].tags, (tags) => {
                      if (tags) {
                        res[i].tags = tags
                      } else {
                        res[i].tags = []
                      }
                    })
                  }
                })
                if (res[i].imgSrc) {
                  await resouredal.getOneBySourceUrl(res[i].uuid, res[i].imgSrc).then(row => {
                    try {
                      if (row) {
                        let val = row
                        if (val.mine) {
                          let locationUrl = `${config.tempPath.image}\\${val.mine}`
                          try {
                            imageHelper.convertBinary2Image(val.data, locationUrl, true)
                          } catch (err) {
                            console.log(err)
                          }
                          // res[i].imgSrc = locationUrl.replace(config.hostPath + '\\', basePath)
                        }
                      }
                    } catch (err) {
                      console.log(err)
                    }
                  }).catch(err => {
                    console.log(err)
                  })
                }
              }
              resolve({
                totalCount: totalCount,
                nodes: res
              })
            } else {
              resolve({
                totalCount: totalCount,
                nodes: res
              })
            }
          }
        })
      }).catch(err => {
        console.log(err)
      })
    })
  },
  getUuidsByCataLogId: (cataLogId) => {
    return new Promise((resolve, reject) => {
      documentdal.getUuidsByCataLogId(cataLogId, cataLogType.personalNote, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          let uuids = []
          if (rows && rows.length) {
            uuids = rows.map((val) => {
              return val.uuid
            })
          }
          resolve(uuids)
        }
      })
    })
  },
  getAllByUuids: (uuids) => {
    return new Promise((resolve, reject) => {
      try {
        documentdal.getDocmentByUUids(uuids, 0, uuids.length, async (err, rs) => {
          if (err) {
            reject(err)
          } else {
            let res = rs
            let currentNum = 0
            if (res && res.length > 0) {
              let isBreak = false
              for (let i = 0; i < res.length; i++) {
                if (isBreak) {
                  break
                }
                let uuid = res[i].uuid
                delete res[i].cataLogId
                delete res[i].uuid
                delete res[i].isUpFile
                delete res[i].isSyncFile
                delete res[i].mac
                db.get(`SELECT content FROM documentcontent WHERE 
                uuid = ?`,
                  [uuid],
                  function (err, row) {
                    if (err) {
                      currentNum++
                      reject(err)
                      isBreak = true
                    } else {
                      if (row) {
                        res[i].content = row.content
                      }
                      if (res[i].imgSrc) {
                        resouredal.getAllByOwnerId(uuid, (err, rows) => {
                          if (err) {
                            currentNum++
                            reject(err)
                            isBreak = true
                          } else {
                            if (rows) {
                              rows.forEach(val => {
                                if (val.data && val.data instanceof Uint8Array) {
                                  val.data = decoder.write(val.data)
                                }
                              })
                              res[i].mimeResource = rows
                            } else {
                              res[i].mimeResource = []
                            }
                            currentNum++
                            if (currentNum === res.length) {
                              resolve(res)
                            }
                          }
                        })
                      } else {
                        currentNum++
                        if (currentNum === res.length) {
                          resolve(res)
                        }
                      }
                    }
                  })
              }
            } else {
              resolve([])
            }
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}
