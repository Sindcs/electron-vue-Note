/**
 * Created by Sind on 2017/3/27.
 * the main sqlite3 db
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
var db = new sqlite3.Database(sqlitFilePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  function (err) {
    if (err) {
      let str = `FAIL on creating database :${dbFilePathName},${err}`
      log.writeErr(str)
      console.log(str)
    } else {
      log.writeDebug('open db success')
      log.writeDebug(db)
    }
  }
)

export default {
  sqliteDb: db
}
