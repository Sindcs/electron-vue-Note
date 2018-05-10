/**
 * Created by Sind on 2017/7/4.
 */
export default {
  dbConnct: {
    syncMongodb: 'mongodb://192.168.106.42:27017/sparkus',
    groupDocumentMongo: 'mongodb://192.168.106.42:27017/sparkus',
    mySql: {
      host: '192.168.107.65',
      user: 'root',
      port: 3306,
      password: 'cnki2016',
      database: 'hy_cpro'
    },
    mySqlForMiddle: {
      host: '192.168.106.42',
      port: 8066,
      user: 'root',
      password: 'cnki',
      database: 'cnki_fileunique_map'
    },
    redis: {
      host: '192.168.106.42',
      port: '6379',
      auth: '',
      db: '6'
    }
  },
  fdfsTrackers: [
    {
      host: '192.168.106.111',
      port: 22122
    }
  ],
  tokenExpireTime: {
    logToken: 2864000000,
    apiAccessToken: 86400000
  },
  appId: 'cnkiksnstool',
  appIdSecretDict: new Map(),
  storeIp: 'http://192.168.106.128'
}
