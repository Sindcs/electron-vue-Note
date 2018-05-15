/**
 * Created by Sind on 2017/4/26.
 * 资源
 */
import log from '../foundation/log'
import sqlite from '../foundation/sqlitdb'

var db = sqlite.sqliteDb

export default {
  getAllByOwnerId: (ownerId, callback) => {
    db.all('SELECT * FROM resource WHERE ownerId = ?',
      [ownerId],
      function (err, rows) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOne resource row:${err} `)
          callback(err, null)
        } else {
          callback(null, rows)
        }
      }
    )
  },
  getOneByUuid: (uuid, callback) => {
    db.get('SELECT * FROM resource WHERE uuid = ?',
      [uuid],
      function (err, row) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to getOne resource row:${err} `)
          callback(err, null)
        } else {
          callback(null, row)
        }
      }
    )
  },
  // 检查是否存在
  checkExist: (ownerId, sourceUrl, md5, callback) => {
    db.get('SELECT count(1) as count FROM resource WHERE sourceUrl = ? AND ownerId = ? AND md5 = ?',
      [sourceUrl, ownerId, md5],
      function (err, row) {
        if (err) {
          console.log(err)
          log.writeErr(`FAIL to checkExist row:${err} `)
          callback(err, null)
        } else {
          callback(null, row.count)
        }
      }
    )
  },
  getOneBySourceUrl: (ownerId, sourceUrl, callback) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT data, mine FROM resource WHERE sourceUrl = ? and ownerId = ?',
        [sourceUrl, ownerId],
        function (err, row) {
          if (err) {
            console.log(err)
            log.writeErr(`FAIL to getOneBySourceUrl row:${err} `)
            reject(err)
            callback(err, null)
          } else {
            resolve(row)
          }
        }
      )
    })
  },
  getOneAllBySourceUrl: (ownerId, sourceUrl, callback) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM resource WHERE sourceUrl = ? and ownerId = ?',
        [sourceUrl, ownerId],
        function (err, row) {
          if (err) {
            console.log(err)
            log.writeErr(`FAIL to getOneAllBySourceUrl row:${err} `)
            reject(err)
            callback(err, null)
          } else {
            resolve(row)
          }
        }
      )
    })
  },
  insert: (resource, callback) => {
    db.run(`INSERT INTO 
    resource (uuid, ownerId, mine, width, height, sourceUrl, dateCreated, size, md5, data) 
    VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [resource.uuid, resource.ownerId, resource.mine, resource.width, resource.height, resource.sourceUrl, Date.now(), resource.size, resource.md5, resource.data],
      (err) => {
        if (err) {
          let str = `insert to resource err:${err}`
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  update: (uuid, newResource, callback) => {
    db.run(`UPDATE resource set 
      data = ?,
      md5 = ?,
      size = ?,
      width = ?,
      height = ?,
      sourceUrl = ?
      WHERE uuid = ?`,
      [newResource.data, newResource.md5, newResource.size, newResource.width, newResource.height, newResource.sourceUrl, uuid],
      (err) => {
        if (err) {
          let str = `update resource err:${err}`
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
    db.run(`DELETE FROM resource 
      WHERE uuid = ?`,
      [uuid],
      (err) => {
        if (err) {
          let str = `DELETE resource err:${err}`
          console.log(str)
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  deleteOneAll: (uuid, callback) => {
    db.run(`DELETE FROM resource 
      WHERE ownerId = ?`,
      [uuid],
      (err) => {
        if (err) {
          let str = `DELETE resource err:${err}`
          console.log(str)
          log.writeErr(str)
          callback(err)
        } else {
          callback(null)
        }
      }
    )
  },
  // 获取所有数据
  getAll: (callback) => {
    db.all('SELECT * FROM resource WHERE isMonitored = 0',
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
  }
}
