/**
 */

import config from '../config/index'
import log from './log'
import util from '../common/util'

var fs = require('fs')
const path = require('path')
var dbFilePathName = `${config.dbPath.sqlite}`
const sqlitFilePath = path.resolve(dbFilePathName)
console.log(sqlitFilePath)
const fileInfo = path.parse(sqlitFilePath)
var exists = fs.existsSync(sqlitFilePath)

async function creatSqlite () {
  if (!exists) {
    let fileDir = fileInfo.dir
    log.writeInfo('Creating DB file: ' + dbFilePathName)
    await util.mkdirs(fileDir, async () => {
      fs.createReadStream(sqlitFilePath)
      log.writeDebug('create sqlite db success')
      // fs.end()
    })
    // fs.openSync(sqlitFilePath, 'w')
  }
}
creatSqlite()
log.writeDebug('require sqlite3')
const sqlite3 = require('sqlite3').verbose()

export const getConnection = () => {
  return new Promise((resolve, reject) => {
    var db = new sqlite3.Database(sqlitFilePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(db)
        }
      }
    )
  })
}
