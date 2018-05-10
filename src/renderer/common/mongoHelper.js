/**
 * Created by Sind on 2017/7/4.
 */
var mongo = require('mongodb')

export default{
  /**
   * 创建数据库服务器并开发名为databaseName的数据库
   * @param host ip
   * @param port 端口
   * @param databaseName
   * @return
   */
  openDatabase: function (host, port, databaseName) {
    //创建数据库所在的服务器
    return new Promise((resolve, reject) => {
      var server = new mongo.Server(host, port, {auto_reconnect: true})
      var db = new mongo.Db(databaseName, server, {safe: true})
      db.open(function (err, db) {
        if (err) {
          console.log('打开数据库失败')
          reject(err)
        }
        else {
          console.log('打开数据库成功')
          resolve(db)
        }
      })
    })
  },
  /**
   * 连接数据集合
   * @param db 数据库
   * @param collectionName 数据集合名称
   * @return
   */
  openCollection: function (db, collectionName) {
    return new Promise((resolve, reject) => {
      db.collection(collectionName, {safe:true}, function(errcollection,collection){
        if(!errcollection){
          console.log('连接数据集合成功')
          resolve(collection)
        }else{
          console.log('连接数集合失败')
          reject(errcollection)
        }
      })
    })
  },

  /**
   * 插入数据
   * @param collection
   * @param tmp 要插入的数据
   * @return
   */
  insertCollection: function (collection, tmp){
    return new Promise((resolve, reject) => {
      collection.insert(tmp, {safe:true}, function(err, result){
        if(err){
          console.log('传入数据集合失败' + tmp)
          reject(collection)
        }else {
          console.log('插入数据集合成功' + result)
          resolve(result)
        }
      })
    })
  },

  /**
   * 查询数据集合 没有条件
   * @param collection
   * @return
   */
  findCollectionNoCondition: function (collection) {
    return new Promise((resolve, reject) => {
      collection.find().toArray(function(errfind, cols){
        if(!errfind){
          console.log('查询数据集合成功' + JSON.stringify(cols))
          resolve(JSON.stringify(cols))
        }else {
          console.log('查询数据集合失败')
          reject(errfind)
        }
      })
    })
  },
  /**
   * 查询数据集合 有条件
   * @param collection
   * @return 成功返回查询到的数据集合内容，失败返回-1
   */
  findCollectionHasCondition: function (collection,tmp) {
    collection.find(tmp).toArray(function(errfind,cols){
      if(!errfind){
        console.log('查询数据集合成功' + JSON.stringify(cols))
        return JSON.stringify(cols)
      }else {
        console.log('查询数据集合失败')
        return -1
      }
    })
  },
  /**
   * 删除数据集合
   * @param collection
   * @param tmp
   * @return 成功返回数据集合，失败返回-1
   */
  removeCollection: function (collection, tmp) {
    collection.remove(tmp, {safe:true}, function(err, count){
      if(err){
        console.log('删除数据集合失败' + tmp)
        return -1
      }else {
        console.log('删除数据集合成功' + count)
        return collection
      }
    })
  }
}
