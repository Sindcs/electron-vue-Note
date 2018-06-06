import noteOperatore from '../../business/noteOperatore'
import resourcedal from '../../dal/resource'
import util from '../../common/util'
import {ResultCode} from '../../model/enumtype'

var fs = require('fs')

export default {
  importFromSprk: (fileFullPath, cataLogId, mac) => {
    return new Promise((resolve, reject) => {
      var lineReader = require('readline').createInterface({
        input: fs.createReadStream(fileFullPath, 'utf-8') // 建立 文件的读取流
      })
      let successCount = 0
      let errorCount = 0
      lineReader.on('line', async jsonStr => {
        lineReader.pause()
        if (jsonStr) {
          try {
            let docs = JSON.parse(jsonStr)
            if (docs.length > 0) {
              for (let i = 0; i < docs.length; i++) {
                let doc = docs[i]
                let note = {
                  uuid: util.getUuid(),
                  isdroped: 0,
                  isShared: 0,
                  isDelete: 0,
                  cataLogId: cataLogId,
                  content: doc.content,
                  abstracts: doc.abstracts,
                  isChanged: 1,
                  isMonitored: 0,
                  isUpFile: 1,
                  isSyncFile: 1,
                  macCode: mac,
                  imgSrc: doc.imgSrc,
                  dateCreated: doc.dateCreated,
                  dateUpdated: doc.dateUpdated,
                  title: doc.title,
                  author: doc.author,
                  sourceUrl: doc.sourceUrl
                }
                if (doc.mimeResource && doc.mimeResource.length) {
                  doc.mimeResource.forEach(async (source) => {
                    source.ownerId = note.uuid
                    source.uuid = util.getUuid()
                    await resourcedal.insert(source, (err) => {
                      if (err) {
                        console.log(err)
                      }
                    })
                  })
                }
                await noteOperatore.insert(note).then(rs => {
                  successCount++
                }).catch(err => {
                  console.log(err)
                  errorCount++
                })
              }
            }
          } catch (err) {
            reject(err)
          }
        }
        lineReader.resume()
      })
      lineReader.on('close', () => {
        resolve({
          total: successCount + errorCount,
          successCount: successCount
        })
      })
    })
  },
  exportToSprk: (cataLogId, filePath) => {
    return new Promise((resolve, reject) => {
      noteOperatore.getUuidsByCataLogId(cataLogId).then(uuids => {
        let pageSize = 10
        let error = ''
        if (uuids) {
          for (let i = 0; (i * pageSize) < uuids.length; i++) {
            if (error) {
              reject(error)
              break
            }
            let innerUUid = uuids.slice(i * pageSize, (i + 1) * pageSize)
            noteOperatore.getAllByUuids(innerUUid).then(docs => {
              if (i === 0) {
                fs.writeFile(filePath, JSON.stringify(docs) + '\r\n', (err) => {
                  if (err) {
                    error = err
                  } else {
                    if ((i + 1) * pageSize >= uuids.length) {
                      resolve()
                    }
                  }
                })
              } else {
                fs.appendFile(filePath, JSON.stringify(docs) + '\r\n', (err) => {
                  if (err) {
                    error = err
                  } else {
                    if ((i + 1) * pageSize >= uuids.length) {
                      resolve()
                    }
                  }
                })
              }
            })
          }
        } else {
          reject(ResultCode.NotFund)
        }
      })
    })
  }
}
