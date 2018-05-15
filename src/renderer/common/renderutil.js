/**
 * Created by Sind on 2017/9/22.
 */
import log from '../foundation/log'

var navigator = window.navigator
var Segmenter = null
try {
  Segmenter = require('node-analyzer')
} catch (err) {
  log.writeErr(err)
}
var segmenter = null
if (Segmenter) {
  segmenter = new Segmenter()
}

export default{
  isOnLine: () => {
    let result = navigator.onLine
    // result = false
    return result
  },
  // 分词
  participleWord: function (text) {
    let str = ''
    if (segmenter) {
      str = segmenter.analyze(text)
      /* if (result && result.length) {
        str = result.join(' ')
      } */
    } else {
      str = text
    }
    return str
  },
  getObjectString: (obj) => {
    let result = ''
    for (let atrr in obj) {
      if (Object.prototype.toString.call(obj[atrr]) === '[object String]') {
        result += obj[atrr] + ' '
      }
    }
    return result
  },
  getPasteClipbordImg: (e, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      var ele = e.clipboardData.items
      for (var i = 0; i < ele.length; ++i) {
        // 判断文件类型
        if (ele[i].kind === 'file' && ele[i].type.indexOf('image/') !== -1) {
          var blob = ele[i].getAsFile() // 得到二进制数据
          // 创建表单对象，建立name=value的表单数据。
          var reader = new FileReader()
          reader.onload = function (event) {
            var image = new Image()
            image.onload = function () {
              var hRatio
              var wRatio
              var Ratio = 1
              var w = image.width
              var h = image.height
              wRatio = maxWidth / w
              hRatio = maxHeight / h
              if (maxWidth === 0 && maxHeight === 0) {
                Ratio = 1
              } else if (maxWidth === 0) {
                if (hRatio < 1) Ratio = hRatio
              } else if (maxHeight === 0) {
                if (wRatio < 1) Ratio = wRatio
              } else if (wRatio < 1 || hRatio < 1) {
                Ratio = (wRatio <= hRatio ? wRatio : hRatio)
              }
              if (Ratio < 1) {
                w = w * Ratio
                h = h * Ratio
              }
              resolve({
                base64Data: event.target.result,
                width: w,
                height: h
              })
            }
            image.src = event.target.result
          }
          reader.readAsDataURL(blob)
        } else {
          resolve()
        }
      }
    })
  }
}
