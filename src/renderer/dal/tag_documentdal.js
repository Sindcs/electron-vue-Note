/**
 */
import sqlite from '../foundation/sqlitdb'
import log from '../foundation/log'
import util from '../common/util'

var db = sqlite.sqliteDb

export default {
  add: (documentId, tagId, callback) => {
    db.run(`INSERT INTO tag_document(uuid, documentId, tagId, isChanged, isDelete) VALUES(?, ?, ?, ?, ?)`,
      [util.getUuid(), documentId, tagId, 1, 0],
      (err) => {
        if (err) {
          let str = `document_document add failer:${err}`
          console.log(str)
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  insert: (relations, callback) => {
    if (relations.isChanged === undefined || relations.isChanged === null) {
      relations.isChanged = 1
    }
    db.run(`INSERT INTO 
    tag_document (uuid, documentId, tagId, isChanged, isDelete) 
    VALUES (?,?,?,?,?)`,
      [relations.uuid, relations.documentId, relations.tagId, relations.isChanged, relations.isDelete],
      (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  delete: (documentId, tagId, callback) => {
    db.get(`SELECT uuid FROM tag_document WHERE documentId = ? AND tagId = ?`,
      [documentId, tagId], (err, row) => {
        if (err) {
          callback(err, null)
          return
        } else {
          db.run(`DELETE FROM tag_document WHERE documentId = ? AND tagId = ?`,
            [documentId, tagId],
            (err) => {
              if (err) {
                let str = `tag_document delete failer:${err}`
                console.log(str)
                log.writeErr(str)
                callback(err, null)
              } else {
                callback(null, row)
              }
            }
          )
        }
      })
  },
  // 获取一个文档的关系数据
  getOneDocTagRelations: (uuid, callback) => {
    db.all('SELECT * FROM tag_document where documentId = ?',
      [uuid],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOneDocTagRelations tag_document row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  getOneRelation: (tagId, documentId, callback) => {
    db.get(`SELECT uuid FROM tag_document WHERE documentId = ? AND tagId = ?`,
      [documentId, tagId], (err, row) => {
        if (err) {
          callback(err, null)
        } else {
          if (row && row.uuid) {
            callback(null, 1)
          } else {
            callback(null, 0)
          }
        }
      })
  },
  // 获取具有相关标签的文档
  getTagsDocuments: (tagIds, callback) => {
    db.all(`SELECT documentId FROM tag_document WHERE tagId in ${util.formatArrayToInStr(tagIds)} GROUP BY documentId`,
      [],
      (err, rows) => {
        if (err) {
          callback(err)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  // 获取所有数据
  getAll: (callback) => {
    db.all('SELECT * FROM tag_document WHERE isMonitored = 0',
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  // 获取发生更改的关系
  getHasChangedRelation: (callback) => {
    db.all('SELECT * FROM tag_document WHERE isChanged = 1',
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  resetIsChanged: (uuid, callback) => {
    db.run(`UPDATE tag_document set 
      isChanged = 0
      WHERE uuid = ?`,
      [uuid],
      (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  resetAllIsChanged: (value, callback) => {
    db.run(`UPDATE tag_document set 
      isChanged = ?`,
      [value],
      (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  deleteOne: (uuid) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM tag_document WHERE uuid = ?`,
        [uuid],
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve('delete')
          }
        }
      )
    })
  }
}
