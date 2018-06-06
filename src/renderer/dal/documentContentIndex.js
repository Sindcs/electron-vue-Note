/**
 */
import sqlite from '../foundation/sqlitdb'
import log from '../foundation/log'

var db = sqlite.sqliteDb

export default {
  insert: (uuid, content, cataLogId, callback) => {
    db.run(`INSERT INTO contentIndex(uuid, cataLogId, content) 
          values(?,?,?)`,
      [uuid, cataLogId, content],
      (err) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null)
        }
      })
  },
  delete: (uuid, callback) => {
    db.run(`DELETE FROM contentIndex 
      WHERE uuid = ?`,
      [uuid],
      (err) => {
        if (err) {
          let str = `DELETE contentIndex err:${err}`
          console.log(str)
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  update: (content, uuid, cataLogId, callback) => {
    db.run(`UPDATE contentIndex set 
      content = ?,
      cataLogId = ?
      WHERE uuid = ?`,
      [content, cataLogId, uuid],
      (err) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  findOne: (uuid, callback) => {
    db.get('SELECT uuid FROM contentIndex WHERE uuid = ?',
      [uuid],
      function (err, row) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to findOne contentIndex row:${err} `)
          callback(err, null)
        } else {
          let count = row && row.uuid ? 1 : 0
          callback(null, count)
        }
      }
    )
  },
  getMatchUUids: (query, cataLogId, callback) => {
    if (query) {
      let paramArray = [cataLogId, query]
      let sql = 'SELECT uuid FROM contentIndex WHERE cataLogId = ? AND content MATCH ?'
      if (!cataLogId) {
        paramArray = [query]
        sql = 'SELECT uuid FROM contentIndex WHERE content MATCH ?'
      }
      db.all(sql,
        paramArray,
        function (err, rows) {
          if (err) {
            callback(err, null)
          } else {
            callback(null, rows)
          }
        }
      )
    } else {
      callback(null, null)
    }
  }
}
