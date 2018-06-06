import nodeStrorage from '../foundation/localstorage'
import config from '../config/index'
import {themeType} from '../assets/themes/index'

export default {
  // 获取最近阅读数据
  getCurrentRead: function () {
    let currentRead = null
    try {
      currentRead = nodeStrorage.getItem('currentRead')
    } catch (err) {
      console.log(err)
    }
    return currentRead
  },
  // 存储当前浏览项
  storeCurrentRead: function (read) {
    let currentRead = null
    if (read instanceof Array) {
      nodeStrorage.setItem('currentRead', read)
      return
    }
    if (read) {
      currentRead = this.getCurrentRead()
      if (currentRead) {
        for (let i = 0; i < currentRead.length; i++) {
          if (currentRead[i].uuid === read.uuid) {
            currentRead.splice(i, 1)
            break
          }
        }
        if (currentRead.length < 100) {
          currentRead.unshift(read)
        } else {
          currentRead.pop()
          currentRead.unshift(read)
        }
      } else {
        currentRead = [read]
      }
    }
    nodeStrorage.setItem('currentRead', currentRead)
  },
  // 获取删除项列表
  getDeleteInfo: function () {
    let deleteInfo = null
    try {
      deleteInfo = nodeStrorage.getItem('deleteInfo')
    } catch (err) {
      console.log(err)
    }
    return deleteInfo
  },
  // 设置删除项列表
  setDeleteInfo: function (info) {
    let deleteInfo
    if (info instanceof Array) {
      nodeStrorage.setItem('deleteInfo', info)
      return
    }
    if (info) {
      deleteInfo = this.getDeleteInfo()
      if (deleteInfo) {
        deleteInfo.push(info)
      } else {
        deleteInfo = [info]
      }
      nodeStrorage.setItem('deleteInfo', deleteInfo)
    }
  },
  // 删除
  clearDeleteInfo: function () {
    nodeStrorage.removeItem('deleteInfo')
  },
  // 删除一条删除记录
  dropDeleteInfoItem: function (info) {
    let deleteInfo = this.getDeleteInfo()
    if (deleteInfo) {
      for (let i = 0; i < deleteInfo.length; i++) {
        if (deleteInfo[i].uuid === info.uuid) {
          deleteInfo.splice(i, 1)
          break
        }
      }
    }
    nodeStrorage.setItem('deleteInfo', deleteInfo)
  },
  // 获取AppSetting
  getAppSettingInfo: function () {
    let appSettingInfo = null
    try {
      appSettingInfo = nodeStrorage.getItem('appSettingInfo')
    } catch (err) {
      console.log(err)
    }
    return appSettingInfo
  },
  // 设置appSettingInfo
  setAppSettingInfo: function (appSettingInfo) {
    let userInfo = this.getAppSettingInfo()
    if (userInfo) {
      for (let attr in appSettingInfo) {
        userInfo[attr] = appSettingInfo[attr]
      }
    }
    nodeStrorage.setItem('appSettingInfo', userInfo)
  },

  initAppSettingInfo: function () {
    if (!this.getAppSettingInfo()) {
      nodeStrorage.setItem('appSettingInfo', {
        indexPath: config.tempPath.downloadPath,
        isSyncNote: true,
        isSyncLiterature: true,
        isSyncThesis: true,
        isSyncAchievement: true,
        isSyncFile: false,
        isSyncUpload: true,
        isSyncDownload: true,
        isAutoLogin: true,
        clickSync: false,
        startSync: true,
        fullScreen: true,
        isAutoCheckUpdate: true
      })
    }
    if (!this.getAppSettingThemeColor()) {
      this.setAppSettingThemeColor(themeType.purple)
    }
  },

  // 设置app主题色
  getAppSettingThemeColor: function () {
    let appSettingThemeColor = null
    try {
      appSettingThemeColor = nodeStrorage.getItem('appThemeColor')
    } catch (err) {
      console.log(err)
    }
    return appSettingThemeColor
  },

  setAppSettingThemeColor: function (appSettingThemeColor) {
    nodeStrorage.setItem('appThemeColor', appSettingThemeColor)
  },
  // 设置当前系统路由状态
  setCurrentRouterState: function (value) {
    let currentRouter = nodeStrorage.getItem('currentRouter')
    if (!currentRouter) {
      currentRouter = {}
    }
    if (value instanceof Map) {
      let result = []
      for (let key of value.keys()) {
        if (key) {
          result.push({
            key: key,
            value: value.get(key)
          })
        }
      }
      currentRouter.routerMap = result
    } else {
      currentRouter.funcMenu = value
    }
    nodeStrorage.setItem('currentRouter', currentRouter)
  },
  // 获取上次历史路由
  getLastRouterState: function () {
    return nodeStrorage.getItem('currentRouter')
  }
}
