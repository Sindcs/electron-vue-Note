/**
 * Created by Sind on 2017/4/26.
 */
import config from '../config/index'
var Datastore = require('nedb-core')
console.log(config.dbPath.nedb)
var nedb = new Datastore({ filename: config.dbPath.nedb })
nedb.loadDatabase(function (err) {
  if (err) {
    console.log(err)
    config.isNedbReady = false
  } else {
    config.isNedbReady = true
  }
})
export default {
  nedb: nedb
}
