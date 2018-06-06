/**
 */
import config from '../config/index'
import log from '../foundation/log'
import util from '../common/util'

var JSONStorage = require('node-localstorage').JSONStorage
const storageLocation = config.dbPath.localstorage
util.mkdirs(storageLocation, () => {
})
log.writeDebug('localstorage path:' + storageLocation)
const nodeStorage = new JSONStorage(storageLocation)
log.writeDebug('init localstorage path success')
export default nodeStorage
