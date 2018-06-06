/**
 * 用户
 */
import config from '../config/staticConfig'
import util from '../common/util'

var JSONStorage = require('node-localstorage').JSONStorage
const storageLocation = config.commLocalStorage
util.mkdirs(storageLocation, () => {
})

const nodeStorage = new JSONStorage(storageLocation)
export default {
  // 存储用户信息
  storeUserInfo: (userInfo) => {
    if (userInfo) {
      nodeStorage.setItem('userInfo', userInfo)
    } else {
      nodeStorage.removeItem('userInfo')
    }
  },
  // 获取用户信息
  getUserInfo: () => {
    return nodeStorage.getItem('userInfo')
  }
}
