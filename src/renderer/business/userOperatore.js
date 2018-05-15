/**
 * Created by Sind on 2017/7/6.
 */
import userDal from '../dal/user'

export default{
  setUserInfo: (userInfo) => {
    userDal.storeUserInfo(userInfo)
  },
  getUserInfo: () => {
    let userInfo = userDal.getUserInfo()
    return userInfo
  },
  getECPUserName: () => {
    let userInfo = userDal.getUserInfo()
    let userName = 'default'
    if (userInfo && userInfo.userName) {
      userName = userInfo.userName
    }
    return userName
  }
}
