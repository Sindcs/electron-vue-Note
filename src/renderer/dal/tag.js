/**
 * Created by Sind on 2017/4/26.
 * 标签
 */
import log from '../foundation/log'
import sqlite from '../foundation/sqlitdb'
import util from '../common/util'

var db = sqlite.sqliteDb

export default {
  getAllByUuids: (uuids, callback) => {
    if (!uuids || uuids.length === 0) {
      callback([])
      return
    }
    db.all(`SELECT * FROM tag WHERE uuid in ${util.formatArrayToInStr(uuids)}`,
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getAll tag row:${err} `)
          callback(null)
        } else {
          callback(rows)
        }
      }
    )
  },
  getByPage: (pageSize, pageIndex, callback) => {
    db.all(`SELECT * FROM tag LIMIT ${pageSize * pageIndex},${pageSize}`,
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getByPage tag row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  getOne: (uuid, callback) => {
    db.get('SELECT * FROM tag WHERE uuid = ?',
      [uuid],
      function (err, row) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOne tag row:${err} `)
          callback(err, null)
        } else {
          callback(null, row)
        }
      }
    )
  },
  getOneByName: (name, callback) => {
    db.get('SELECT * FROM tag WHERE name = ?',
      [name],
      function (err, row) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOneByName tag row:${err} `)
          callback(err, null)
        } else {
          callback(null, row)
        }
      }
    )
  },
  getByNameQuery: (name, callback) => {
    let sql = `SELECT * FROM tag WHERE name like '${name}%'`
    if (!name) {
      sql = 'SELECT * FROM tag'
    }
    db.all(sql,
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOneByName tag row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  getByQuery: (tags, callback) => {
    db.all(`SELECT uuid from tag WHERE name in ${util.formatArrayToInStr(tags)}`,
      [],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOneByName tag row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      })
  },
  insert: (tag, callback) => {
    if (tag.isChanged === undefined || tag.isChanged === null) {
      tag.isChanged = 1
    }
    if (!tag.dateCreated) {
      tag.dateCreated = Date.now()
    }
    db.run(`INSERT INTO 
    tag (uuid, name, isChanged, dateCreated) 
    VALUES (?,?,?,?)`,
      [tag.uuid, tag.name, tag.isChanged, tag.dateCreated],
      (err) => {
        if (err) {
          let str = `insert to tag err:${err}`
          log.logErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  update: (uuid, name, isChanged, callback) => {
    db.run(`UPDATE tag set 
      name = ?,
      isChanged = ?
      WHERE uuid = ?`,
      [name, isChanged, uuid],
      (err) => {
        if (err) {
          let str = `update tag err:${err}`
          console.log(str)
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  // 待定
  deleteOne: (uuid, callback) => {
    db.run(`DELETE FROM tag 
      WHERE uuid = ?`,
      [uuid],
      (err) => {
        if (err) {
          let str = `DELETE tag err:${err}`
          console.log(str)
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  // 获取发生更改的目录列表
  getHasChangedTags: (callback) => {
    db.all('SELECT * FROM tag WHERE isChanged = 1',
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
    db.run(`UPDATE tag set 
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
    db.run(`UPDATE tag set 
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
  // 获取所有数据
  getAll: (callback) => {
    db.all('SELECT * FROM tag',
      [],
      function (err, rows) {
        if (err) {
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  }
}
