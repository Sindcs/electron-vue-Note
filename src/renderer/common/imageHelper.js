/**
 * Created by Sind on 2017/6/27.
 */
import util from '../common/util'
var http = require('http')
var https = require('https')
var nodeUrl = require('url')
var fs = require('fs')

export default {
  convertImage2Binary: (url, fileDirection) => {
    return new Promise((resolve, reject) => {
      if (url.indexOf('//localhost') < 0 && !fileDirection) {
        let protocol = http
        let result = nodeUrl.parse(url)
        const options = {
          hostname: result.hostname,
          port: result.port,
          path: result.path,
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.0.3) Gecko/2008092417 Firefox/3.0.3',
            'Accept': 'text/html,application/xhtml+xml,application/xml;',
            'Connection': 'Keep-Alive',
            'Cache-Control': 'no-cache',
            'Referer': `${result.protocol}//${result.hostname}/`
          }
        }
        if (result.protocol === 'https:') {
          protocol = https
        }
        var req = protocol.request(options, function (res) {
          if (res.statusCode === 200) {
            var imgData = ''
            res.setEncoding('binary') // 一定要设置response的编码为binary否则会下载下来的图片打不开
            res.on('data', function (chunk) {
              imgData += chunk
            })
            res.on('end', function () {
              resolve(imgData)
            })
          } else {
            reject(res.statusCode)
          }
          res.on('error', function (err) {
            reject(err)
          })
        })
        req.on('error', function (err) {
          reject(err)
        })
        req.end()
      } else {
        if (fileDirection) {
          fs.readFile(`${fileDirection}${util.getFileName(url)}`, 'binary', function (err, imgData) {
            if (err) {
              reject(err)
            } else {
              resolve(imgData)
            }
          })
        } else {
          reject()
        }
      }
    })
  },
  convertBinary2Image: (imgData, locationFullPath, isSync) => {
    if (!isSync) {
      if (Buffer.isBuffer(imgData)) {
        fs.writeFile(locationFullPath, imgData, () => {})
      } else {
        fs.writeFile(locationFullPath, imgData, 'binary', () => {})
      }
    } else {
      if (Buffer.isBuffer(imgData)) {
        fs.writeFileSync(locationFullPath, imgData)
      } else {
        fs.writeFileSync(locationFullPath, imgData, 'binary')
      }
    }
  },
  convertImageToBase64: (url) => {
    return new Promise((resolve, reject) => {
      var req = http.get(url, function (res) {
        if (res.statusCode === 200) {
          var chunks = []
          let size = 0
          res.on('data', function (chunk) {
            chunks.push(chunk)
            size += chunk.length
          })
          res.on('end', function () {
            var data = Buffer.concat(chunks, size)
            var base64Img = data.toString('base64')
            resolve('data:image/png;base64,' + base64Img)
          })
        }
        res.on('error', function (err) {
          reject(err)
        })
      })
      req.on('error', function (err) {
        reject(err)
      })
    })
  }
}
