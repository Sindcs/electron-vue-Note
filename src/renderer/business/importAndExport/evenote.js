import noteOperatore from '../../business/noteOperatore'
import resourcedal from '../../dal/resource'
import util from '../../common/util'
import staticConfig from '../../config/staticConfig'
import {ResultCode} from '../../model/enumtype'

const StringDecoder = require('string_decoder').StringDecoder
const decoder = new StringDecoder('binary')
var xml2js = require('xml2js')
var fs = require('fs')

export default {
  importFromEnex: (fileFullPath, cataLogId, mac) => {
    return new Promise((resolve, reject) => {
      let fileState = fs.statSync(fileFullPath)
      if (fileState.size > staticConfig.evernoteList) {
        reject(ResultCode.NotSupport)
      } else {
        fs.readFile(fileFullPath, 'utf-8', function (err, xmlStr) {
          if (err) {
            reject(err)
          } else {
            xml2js.parseString(xmlStr, {
              explicitArray: false
            }, async (err, result) => {
              if (err) {
                reject(err)
              } else {
                let noteResultList = []
                if (result) {
                  let exports = result['en-export']
                  let xmlNoteList = exports.note
                  if (!(xmlNoteList instanceof Array)) {
                    xmlNoteList = [exports.note]
                  }
                  let successCount = 0
                  let errorCount = 0
                  if (xmlNoteList.length > 0) {
                    for (let i = 0; i < xmlNoteList.length; i++) {
                      let thisXmlNode = xmlNoteList[i]
                      let contentXml = thisXmlNode.content
                      let content = contentXml.substring(contentXml.indexOf('<en-note>') + 9).replace('</en-note>', '')
                      let note = {
                        uuid: util.getUuid(),
                        isdroped: 0,
                        isShared: 0,
                        isDelete: 0,
                        macCode: mac,
                        cataLogId: cataLogId,
                        content: content,
                        isChanged: 1,
                        isMonitored: 0,
                        isUpFile: 1,
                        isSyncFile: 1,
                        dateCreated: util.getTimestamp(thisXmlNode.created),
                        dateUpdated: util.getTimestamp(thisXmlNode.updated),
                        title: thisXmlNode.title,
                        author: thisXmlNode.author,
                        sourceUrl: thisXmlNode['source-url']
                      }
                      if (thisXmlNode.resource) {
                        let resourceList = thisXmlNode.resource
                        if (!(thisXmlNode.resource instanceof Array)) {
                          resourceList = [thisXmlNode.resource]
                        }
                        let maxImageLength = 0
                        for (let i = 0; i < resourceList.length; i++) {
                          let val = resourceList[i]
                          let b64string = val.data._
                          if (b64string) {
                            let imagData = Buffer.from(b64string, 'base64')
                            let md5 = util.getMd5(imagData)
                            if (imagData.length > maxImageLength) {
                              maxImageLength = imagData.length
                              let name = `${util.getUuid()}.gif`
                              note.imgSrc = name
                              await resourcedal.insert({
                                uuid: util.getUuid(),
                                ownerId: note.uuid,
                                mine: name,
                                width: 0,
                                height: 0,
                                sourceUrl: name,
                                size: 0,
                                md5: md5,
                                data: decoder.write(imagData)
                              }, (err) => {
                                if (err) {
                                  console.log(err)
                                }
                              })
                            }
                            var reg = new RegExp(`<en-media [^<>]*hash="${md5}" [^<>]*((></en-media>)|(/>))`, 'g')
                            note.content = note.content.replace(reg, `<img src="data:${val.mime};base64,${b64string}" />`)
                          }
                        }
                      }
                      note.abstracts = util.getAbstracts(note.content, note.title)
                      await noteOperatore.insert(note).then(rs => {
                        successCount++
                        noteResultList.push(rs)
                        if (successCount + errorCount === xmlNoteList.length) {
                          resolve({
                            total: xmlNoteList.length,
                            successCount: successCount
                          })
                        }
                      }).catch(err => {
                        console.log(err)
                        errorCount++
                      })
                    }
                  } else {
                    resolve({
                      total: xmlNoteList.length,
                      successCount: successCount
                    })
                  }
                }
              }
            })
          }
        })
      }
    })
  }
}
