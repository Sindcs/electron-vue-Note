/**
 * Created by Sind on 2017/4/17.
 * 数据库初始化
 */
import log from '../foundation/log'
import sqlite from '../foundation/sqlitdb'

var db = sqlite.sqliteDb
const nedb = require('../foundation/nedb')
const dbinit = {}
dbinit.initDatabase = function () {
  return nedb.db
}
dbinit.initTable = function () {
  return new Promise((resolve, reject) => {
    let i = 0
    if (db) {
      log.writeDebug('start to create sqlite table')
      // create resource
      db.run(`CREATE TABLE IF NOT EXISTS resource
        (
          uuid VARCHAR(36) PRIMARY KEY,
          ownerId VARCHAR(36), 
          mine VARCHAR(50), 
          width integer,
          height integer,
          sourceUrl VARCHAR(200),
          dateCreated INTEGER,
          size INTEGER,
          md5 VARCHAR(32),
          data blob
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table resource:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create favorites
      db.run(`CREATE TABLE IF NOT EXISTS favorites 
        (
          uuid VARCHAR(36) PRIMARY KEY,
          documentId VARCHAR(36),
          type VARCHAR(6),
          isChanged integer,
          isMonitored integer,
          favoritesTimes INTEGER
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table favorites:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create cataLog
      db.run(`CREATE TABLE IF NOT EXISTS cataLog 
        (
          uuid VARCHAR(36) PRIMARY KEY,
          name VARCHAR(100),
          type VARCHAR(4),
          isMonitored integer,
          isChanged integer,
          cataLogChain VARCHAR(800),
          monitoredPath VARCHAR(2000),
          childNum integer,
          docNum integer,
          parentCataLogId VARCHAR(36),
          dateCreated integer
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table cataLog:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create tag
      db.run(`CREATE TABLE IF NOT EXISTS tag 
        (
          uuid VARCHAR(36) PRIMARY KEY,
          name VARCHAR(100),
          isChanged integer,
          dateCreated integer
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table tag:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create user
      db.run(`CREATE TABLE IF NOT EXISTS user 
        (
          uuid VARCHAR(36) PRIMARY KEY,
          name VARCHAR(100),
          fullName VARCHAR(100),
          dateCreated integer,
          email VARCHAR(50),
          notebookCount integer,
          literatureCount integer,
          documentMaterial integer
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table user:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create document_document
      db.run(`CREATE TABLE IF NOT EXISTS document_document 
        (
          uuid VARCHAR(36),
          documentId VARCHAR(36),
          rdocumentId VARCHAR(36),
          isChanged integer,
          isDelete integer
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table document_document:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create document_document
      db.run(`CREATE TABLE IF NOT EXISTS tag_document 
        (
          uuid VARCHAR(36),
          documentId VARCHAR(36),
          tagId VARCHAR(36),
          isChanged integer,
          isDelete integer
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table tag_document:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create documentcontent
      db.run(`CREATE TABLE IF NOT EXISTS documentcontent 
        (
          uuid VARCHAR(32) PRIMARY KEY,
          content TEXT
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table documentcontent:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create contentIndex
      db.run(`CREATE VIRTUAL TABLE IF NOT EXISTS contentIndex USING fts4
        (
          uuid VARCHAR(36) PRIMARY KEY,
          cataLogId VARCHAR(36),
          content TEXT
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table contentIndex:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create chatMessage
      db.run(`CREATE TABLE IF NOT EXISTS chatmessage
        (
          uuid VARCHAR(36) PRIMARY KEY,
          fromId VARCHAR(36),
          content TEXT,
          inputTime integer
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table chatmessage:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
      // create chatList
      db.run(`CREATE TABLE IF NOT EXISTS chatList
        (
          friendId VARCHAR(36) PRIMARY KEY,
          type VARCHAR(20),
          inputTime integer
        )`,
        function (err) {
          if (err) {
            log.writeErr(`FAIL on creating table chatList:${err}`)
            reject(err)
          } else {
            i++
            if (i === 10) {
              resolve()
            }
          }
        }
      )
    } else {
      reject()
    }
  })
}

export default dbinit
