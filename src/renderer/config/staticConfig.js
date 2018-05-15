/**
 * Created by Sind on 2017/7/7.
 */
var app = {}
var remote = require('electron').remote
if (remote) {
  app = remote.app
} else {
  app = require('electron').app
}
export default {
  apiurl: {
    // 一般api
    comment: 'http://192.168.106.42:7567/WebApi/api/v0/',
    // 同步相关api
    sync: 'http://192.168.106.42:7567/sync_api/v0/',
    // 文件系统api
    fileSystem: {
      host: '192.168.106.42',
      port: '7567',
      baseUrl: '/file_api/v0/'
    },
    syncHttp: {
      host: '192.168.106.42',
      port: '7567',
      baseUrl: '/sync_api/v0/'
    },
    // 文档文件存储api地址
    fileSystemServer: 'http://192.168.106.42:7567/file_api/v0/',
    // 用户图片存储api
    imageFileSystem: 'http://192.168.106.42:7567/file_api/v0/',
    // 用户账号api
    account: 'http://192.168.106.42:7567/WebApi/api/v0/',
    // 群组相关api
    group: 'http://192.168.106.42:7567/group_api/api/v0/',
    // 软件更新相关api
    update: 'http://192.168.106.42:7567/WebApi/api/v0/',
    // 英文概要提取api
    grobid: 'http://192.168.106.42:7567/'
  },
  BOSH_SERVICE: 'http://192.168.106.42:7070/http-bind/',
  fileLimitSize: {
    size: 104857600
  },
  imageLimit: 1024 * 1024 * 12, // 12m
  evernoteList: 1024 * 1024 * 150,
  sprkLimt: 1024 * 1024 * 150,
  // 聊天域名
  chatServerDomain: '@db8z3h62',
  // 聊天室域名
  chatRoomServerDomain: '@conference.db8z3h62',
  imageStoreIp: 'http://192.168.106.128/',
  // .net lib目录
  netLibPath: 'resources/lib/SDocumentEdge.dll',
  netPdfLibPath: 'resources/lib/SDocumentPdfEdge.dll',
  commLocalStorage: app.getPath('userData'),
  exportPdfSuffix: ['pdf', 'caj', 'nh', 'kdh'],
  // 表情图片所在位置
  baseEmojisUrl: 'plugins/static/emoji/',
  dtSuffix: 'sprk',
  hostPath: '',
  appId: 'cnkiksnstool',
  accessSecret: 'ddwdsadasdasdwdsdcsww',
  timestamp: {
    syncUpload: 1800000, // 30分钟
    tokenTimeOut: 3600000 // 1小时
  },
  envirnomentSources: [
    {
      url: 'https://www.microsoft.com/zh-CN/download/details.aspx?id=48145',
      name: 'Visual Studio 2015 redist',
      describe: '程序运行文档信息提取必须运行库'
    },
    {
      url: 'https://www.microsoft.com/zh-CN/download/details.aspx?id=30653',
      name: '.NET framework 4.5',
      describe: '程序运行文档信息提取必须运行库'
    }
  ]
}
