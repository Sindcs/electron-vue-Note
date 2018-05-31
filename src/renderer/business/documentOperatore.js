/**
 * Created by Sind on 2017/4/28.
 * 文档操作类
 */
import documentdal from '../dal/documentdal'
import sqlite from '../foundation/sqlitdb'
import tagdal from '../dal/tag'
import cataLogOperatore from '../business/cataLogOperatore'
import resouredal from '../dal/resource'
import appConfig from '../config/appConfig'
import tagdocument from '../dal/tag_documentdal'
import config from '../config/index'
import ipcMessage from '../common/ipcMessage'
import renderUtil from '../common/renderutil'
import documentContentIndex from '../dal/documentContentIndex'
import util from '../common/util'
var enumType = require('../model/enumtype')

var db = sqlite.sqliteDb
var path = require('path')
var fs = require('fs')

export default {
    formatTagQueryUuids: (queryParam) => {
        let param = util.deepClone(queryParam)
        return new Promise((resolve, reject) => {
          if (param !== undefined && param.tagInfo) {
            let uuids = [param.tagInfo.uuid]
            tagdocument.getTagsDocuments(uuids, (err, tagDocs) => {
              if (err) {
                reject(err)
              } else {
                param.uuids = tagDocs.map(m => {
                  return m.documentId
                })
                documentContentIndex.getMatchUUids(param.query, param.cataLogId, (err, rows) => {
                  if (err) {
                    reject(err)
                  } else {
                    if (rows) {
                      // param.query = ''
                      let uuids = rows.map(m => {
                        return m.uuid
                      })
                      param.orUuids = uuids.length ? uuids : null
                    }
                    resolve(param)
                  }
                })
              }
            })
          } else {
            if (param) {
              documentContentIndex.getMatchUUids(param.query, param.cataLogId, (err, rows) => {
                if (err) {
                  reject(err)
                } else {
                  if (rows) {
                    // param.query = ''
                    let uuids = rows.map(m => {
                      return m.uuid
                    })
                    param.orUuids = uuids.length ? uuids : null
                  }
                }
                resolve(param)
              })
            } else {
              resolve(param)
            }
          }
        })
    }
}
