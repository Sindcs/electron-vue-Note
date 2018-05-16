/**
 * Created by Sind on 2017/4/26.
 * 目录
 */
import log from '../foundation/log'
import util from '../common/util'
import sqlite from '../foundation/sqlitdb'

var db = sqlite.sqliteDb

export default {
  getAllUuids: (callback) => {
    db.all('SELECT uuid FROM cataLog',
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOne cataLog row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  getCataLogNameByUuids: (uuids, callback) => {
    let uuidInStr = util.formatArrayToInStr(uuids)
    db.all(`SELECT name FROM cataLog WHERE uuid IN ${uuidInStr}`,
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOne cataLog row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  checkExist: (name, cataLogId, callback) => {
    db.get('SELECT count(1) as count FROM cataLog WHERE parentCataLogId = ? AND name = ?',
      [cataLogId, name],
      function (err, row) {
        if (err) {
          callback(err, null)
        } else {
          callback(null, row)
        }
      })
  },
  // 获取监控文件夹
  getMonitoredCataLog: (callback) => {
    db.all('SELECT * FROM cataLog WHERE isMonitored = 1',
      [],
      function (err, rows) {
        if (err) {
          callback(err, null)
        } else {
          callback(null, rows)
        }
      })
  },
  getByType: (type, callback) => {
    db.all('SELECT * FROM cataLog where type = ?',
      [type],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOne cataLog row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  // 获取一个文件夹的所有子目录
  getOneAllChild: (uuid, item, callback) => {
    let selectSql = 'SELECT * FROM cataLog WHERE parentCataLogId = ? AND isMonitored = 0 ORDER BY dateCreated'
    db.all(selectSql,
      [uuid], (err, rows) => {
        if (err) {
          console.log(err)
          log.writeErr(err)
          callback(err, null)
        } else {
           if (rows.length > 0) {
             for (let i = 0; i < rows.length; i++) {
               this['a'].getOneAllChild(rows[i].uuid, rows[i], callback)
             }
           }
          item.childList = rows
          callback(null, rows)
        }
      }
    )
  },
  getOneChildCount: (uuid, callback) => {
    db.all('SELECT count(1) as count FROM cataLog WHERE parentCataLogId = ?',
      [uuid], (err, row) => {
        if (err) {
          console.log(err)
          log.writeErr(err)
          callback(err, null)
        } else {
          callback(null, row[0].count)
        }
      }
    )
  },
  getOne: (uuid, callback) => {
    db.get('SELECT * FROM cataLog WHERE uuid = ?',
      [uuid],
      function (err, row) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOne cataLog row:${err} `)
          callback(err, null)
        } else {
          callback(null, row)
        }
      }
    )
  },
  insert: (catalog, callback) => {
    if (catalog.isChanged === undefined || catalog.isChanged === null) {
      catalog.isChanged = 1
    }
    if (!catalog.dateCreated) {
      catalog.dateCreated = Date.now()
    }
    db.run(`INSERT INTO 
    cataLog (uuid, name, type, isMonitored, isChanged, cataLogChain, monitoredPath, childNum, docNum, parentCataLogId, dateCreated) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [catalog.uuid, catalog.name, catalog.type, catalog.isMonitored, catalog.isChanged, catalog.cataLogChain, catalog.monitoredPath, 0, 0, catalog.parentCataLogId, catalog.dateCreated], 
      (err) => {
        if (err) {
          let str = `insert to cataLog err:${err}`
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      })
  },
  updateName: (uuid, name, isChanged, callback) => {
    db.run(`UPDATE cataLog set 
      name = ?,
      isChanged = ?
      WHERE uuid = ?`,
      [name, isChanged, uuid],
      (err) => {
        if (err) {
          let str = `update catalog err:${err}`
          console.log(str)
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  increaseDocNum: (uuid, callback) => {
    db.run(`UPDATE cataLog set 
      docNum = docNum++
      WHERE uuid = ?`,
      [uuid],
      (err) => {
        if (err) {
          let str = `increaseDocNum catalog err:${err}`
          console.log(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  decreaseDocNum: (uuid, callback) => {
    db.run(`UPDATE cataLog set 
      docNum = docNum--
      WHERE uuid = ?`,
      [uuid],
      (err) => {
        if (err) {
          let str = `decreaseDocNum catalog err:${err}`
          console.log(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  // 待定
  deleteOne: (uuid, callback) => {
    db.run(`DELETE FROM cataLog 
      WHERE uuid = ?`,
      [uuid],
      (err) => {
        if (err) {
          let str = `DELETE catalog err:${err}`
          console.log(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  // 获取发生更改的目录列表
  getHasChangedCataLogs: (callback) => {
    db.all('SELECT * FROM cataLog WHERE isChanged = 1 And isMonitored = 0',
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
  // 重新设置更新状态
  resetIsChanged: (uuid, callback) => {
    db.run(`UPDATE cataLog set 
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
  // 获取所有数据
  getAll: (callback) => {
    db.all('SELECT * FROM cataLog WHERE isMonitored = 0',
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
  // 重新设置所有状态
  resetAllIsChanged: (value, callback) => {
    db.run(`UPDATE cataLog set 
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
  // 更改catalogParentId
  changCataLogParentId: (cataLogId, parentId, catalogChain, callback) => {
    db.run(`UPDATE cataLog set 
      parentCataLogId = ?, cataLogChain = ?,isChanged = 1 WHERE uuid = ?`,
      [parentId, catalogChain, cataLogId],
      (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  // 更改catalogParentId
  changCataLogOrder: (cataLogId, frontOrderId, backOrderId, callback) => {
    db.serialize(function () {
      db.run('BEGIN')
      db.run(`UPDATE cataLog set 
      orderId = orderId + 1,isChanged = 1 WHERE orderId >= ?`,
        [backOrderId],
        (err) => {
          if (err) {
            db.run('ROLLBACK')
            callback(err)
          } else {
            db.run(`UPDATE cataLog set 
            orderId = ?,isChanged = 1 WHERE uuid = cataLogId`,
              [frontOrderId],
              (err) => {
                if (err) {
                  db.run('ROLLBACK')
                  callback(err)
                } else {
                  db.run('COMMIT')
                  callback(null)
                }
              })
          }
        })
    })
  }
}
