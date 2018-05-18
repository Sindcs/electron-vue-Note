/**
 * Created by Sind on 2017/5/27.
 */
import documentdal from '../dal/documentdal'
import tagdal from '../dal/tag'
import tagdocumentdal from '../dal/tag_documentdal'
import documentOperator from '../business/documentOperatore'

export default {
  // 笔记部分搜索
  searchNodeList: (cataLogId, query) => {
    return new Promise((resolve, reject) => {
      documentdal.queryDocmentByCataLogId(cataLogId, query, 0, 1000000, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  // 根据标题模糊查询
  searchByTitle: (qurey) => {
    return new Promise((resolve, reject) => {
      documentdal.queryDocmentByTitle(qurey, 0, 100000, (err, res) => {
        if (err) {
          resolve(err)
        } else {
          reject(res)
        }
      })
    })
  },
  // 全文检索
  fullTextSearch: (type, query, pageIndex, pageSize) => {
    return new Promise((resolve, reject) => {
      documentOperator.formatTagQueryUuids(query).then(queryParam => {
        documentdal.queryDocmentByTitleAndContent(type, queryParam, pageIndex, pageSize, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  searchTotalByTitle: (query, pageIndex, pageSize) => {
    return new Promise((resolve, reject) => {
      documentdal.queryDocmentByTitle(query, pageIndex, pageSize, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  },
  // 分类赛选
  classifySearch: (param, pageIndex, pageSize) => {
    return new Promise((resolve, reject) => {
      if (param.tags) {
        tagdal.getByNameQuery(param.tags, (err, tagInfos) => {
          if (err) {
            reject(err)
          } else {
            if (tagInfos && tagInfos.length !== 0) {
              let uuids = tagInfos.map(m => {
                return m.uuid
              })
              if (param.tagInfo) {
                uuids = [param.tagInfo.uuid]
              }
              tagdocumentdal.getTagsDocuments(uuids, (err, tagDocs) => {
                if (err) {
                  reject(err)
                } else {
                  param.uuids = tagDocs.map(m => {
                    return m.documentId
                  })
                  documentdal.queryDocByMultipleCondition(param, pageIndex, pageSize, (err, rows) => {
                    if (err) {
                      reject(err)
                    } else {
                      documentOperator.getDocumentTags(rows).then(res => {
                        resolve(res)
                      }).catch(() => {
                        reject(rows)
                      })
                    }
                  })
                }
              })
            }
          }
        })
      } else {
        let uuids = []
        if (param.tagInfo) {
          uuids = [param.tagInfo.uuid]
          tagdocumentdal.getTagsDocuments(uuids, (err, tagDocs) => {
            if (err) {
              reject(err)
            } else {
              param.uuids = tagDocs.map(m => {
                return m.documentId
              })
              documentdal.queryDocByMultipleCondition(param, pageIndex, pageSize, (err, rows) => {
                if (err) {
                  reject(err)
                } else {
                  documentOperator.getDocumentTags(rows).then(res => {
                    resolve(res)
                  }).catch(() => {
                    reject(rows)
                  })
                }
              })
            }
          })
        } else {
          documentdal.queryDocByMultipleCondition(param, pageIndex, pageSize, (err, res) => {
            if (err) {
              reject(err)
            } else {
              documentOperator.getDocumentTags(res).then(res => {
                resolve(res)
              }).catch(() => {
                reject(res)
              })
            }
          })
        }
      }
    })
  }
}
