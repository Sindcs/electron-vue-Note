/**
 */

import db from '../foundation/sqlitdb'

// 执行事务
export const doTransaction = function (sqls, callbackFunc, funcParams, callback) {
  db.serialize(function () {
    db.run('BEGIN')
    for (let i = 0; i < sqls.length; i++) {
      let sql = sqls[i]
      let stmt = db.run(sql)
      stmt.run((err) => {
        if (err) {
          break
        } else {
          stmt.finalizer()
        }
      })
    }
    let stmt = db.prepare(sql)
    var ierr = null
    stmt.run((err) => {
      ierr = err
      if (!err) {
        callbackFunc(funcParams, (err) => {
          ierr = err
          if (!err) {
            stmt.finalizer()
            db.run('COMMIT')
          } else {
            db.run('ROLLBACK')
          }
        })
      }
      callback(ierr)
    })
  })
}
