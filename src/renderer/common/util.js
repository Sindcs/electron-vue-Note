//const uuidV1 = require('uuid')
var $ = require('jquery')
var documentType = require('../model/enumtype').documentType
const uuidV1 = require('uuid/v1')
var crypto = require('crypto')
var fs = require('fs')
var os = require('os')
var path = require('path')

export default {
  getSyncApiUrl: (url) => {
    return `/sync_api/v0${url}`
  },
  getFileApiUrl: (url) => {
    return `/file_api/v0${url}`
  },
  // 获取uuid
  getUuid: function () {
    return 'dadad'
  },
  removeStyle: function (dom) {
    let nodeName = dom.prop("nodeName");
    if (nodeName) {
      nodeName = nodeName.toLowerCase();
      const exceptList = [
        'title',
        'style',
        'script',
        'meta',
        'link',
        'dialog',
        'audio',
        'embed',
        'video',
        'wbr'
      ];
      if (exceptList.indexOf(nodeName) >= 0) {
        dom.remove();
        return false;
      }
    } else {
      return false;
    }
    dom.removeAttr('onchange');
    dom.removeAttr('onclick');
    dom.removeAttr('onmouseout');
    dom.removeAttr('onmouseover');
    dom.removeAttr('onmousedown');
    dom.removeAttr('onmouseup');
    dom.removeAttr('onfocus');
    dom.removeAttr('class');
    dom.removeAttr('id');
    var href = dom.attr('href');
    let lhref = '';
    if (href) {
      lhref = href.toLowerCase();
    }
    if (href && !(lhref.indexOf('http:') === 0 || lhref.indexOf('https:') === 0)) {
      dom.removeAttr('href');
    }
    let style = dom.attr('style');
    if (style) {
      let removeStyle = [
        'color',
        'font-size',
        'font-family',
        'font-style',
        'font-weight',
        'letter-spacing',
        'word-spacing',
        'font'
      ];
      for (let attr of removeStyle) {
        let regStr = `${attr}[\s]*:[\s]*[^<>;]*;`;
        style = style.replace(new RegExp(regStr, 'gi'), '');
        regStr = `${attr}[\s]*:[\s]*[^<>;]*"`;
        style = style.replace(new RegExp(regStr, 'gi'), '"');
      }
      dom.attr('style', style);
    }
    let childList = dom.children();
    if (childList && childList.length) {
      childList.each((index, element) => {
        this.removeStyle($(element));
      });
    }
    return true;
  },
  // 获取文件名
  getFileName: function (path) {
    if (path) {
      let innerPath = path
      innerPath = innerPath.replace(new RegExp('\\\\', 'gm'), '/')
      innerPath = innerPath.substring(innerPath.lastIndexOf('/') + 1)
      let index = innerPath.indexOf('?')
      if (index > 0) {
        innerPath = innerPath.substring(0, index)
      }
      return innerPath
    } else {
      return ''
    }
  },
  getDirection: function (filePath) {
    return filePath.replace(this.getFileName(filePath), '')
  },
  // 获取文件后缀
  getSuffix: function (path) {
    let innerPath = path
    var name = this.getFileName(innerPath)
    if (name.lastIndexOf('.') < 0) {
      return ''
    }
    var suffix = innerPath.substring(innerPath.lastIndexOf('.') + 1)
    return suffix
  },
  buildUrl: function (baseUrl, resourceUrl) {
    return baseUrl + resourceUrl
  },
  // 获取uuid
  getUuid: function () {
    return uuidV1()
  },
  getTimestamp: function (time) {
    let result
    if (time) {
      time = time.replace('T', '')
      let year = time.substring(0, 4)
      let mouth = time.substring(4, 6)
      let day = time.substring(6, 8)
      let hour = time.substring(8, 10)
      let m = time.substring(10, 12)
      let s = time.substring(12)
      let date = `${year}-${mouth}-${day} ${hour}:${m}:${s}`
      result = Date.parse(new Date(date))
    }
    if (!result) {
      result = new Date()
    }
    return result
  },
  // 转换数组为in 后字符
  formatArrayToInStr: function (array) {
    let resStr = '('
    array.forEach(item => {
      resStr += '\'' + item + '\','
    })
    resStr = resStr.substring(0, resStr.length - 1) + ')'
    return resStr
  },
  arrayIntersection: function (a, b) {
    var result = []
    if (!a || !a.length) {
      return b
    }
    if (!b || !b.length) {
      return a
    }
    let small = a
    let max = b
    if (a.length > b.length) {
      small = b
      max = a
    }
    if (small && max && small.length && max.length) {
      for (let i = 0; i < small.length; i++) {
        for (let j = 0; j < max.length; j++) {
          if (small[i] === max[j]) {
            result.push(small[i])
            break
          }
        }
      }
    }
    return result
  },
  // 获取选中的文本
  getSelectionText: function (id) {
    var text = ''
    if (typeof window.getSelection !== 'undefined') {
      var sel = window.getSelection()
      if (sel.rangeCount) {
        var container = document.createElement('div')
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents())
        }
        text = container.innerText
      }
    } else if (typeof document.selection !== 'undefined') {
      if (document.selection.type === 'Text') {
        text = document.selection.createRange().text
      }
    }
    return text
  },
  // 格式化html标签
  stripHTML: function (html) {
    html = html.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
    html = html.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
    html = html.replace(/\n[\s| | ]*\r/g, '\n') // 去除多余空行
    html = html.replace(/&nbsp;/ig, '') // 去掉&nbsp;
    return html
  },
  // 空值判断
  isNullOrEmpty: function (variable1) {
    if (variable1 === null || variable1 === undefined || variable1 === '') {
      return true
    }
    return false
  },
  startWith: function (c, s) {
    if (s === null || s === '' || c.length === 0 || s.length > c.length) {
      return false
    }
    if (c.substr(0, s.length) === s) {
      return true
    } else {
      return false
    }
  },
  // 获取页数
  getPage: (perPageCount, totalCount) => {
    return Math.ceil(totalCount / perPageCount)
  },
  indexOf: (array, item) => {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return i
      }
    }
    return -1
  },
  exist: (array, item) => {
    let index = array.indexOf(array, item)
    if (index > -1) {
      return array[index]
    } else {
      for (let i = 0; i < array.length; i++) {
        if (array[i].uuid === item.uuid) {
          return array[i]
        }
      }
    }
    return null
  },
  remove: (array, item, callback) => {
    let index = array.indexOf(item)
    let curentItem = null
    if (index < 0) {
      for (let i = 0; i < array.length; i++) {
        if ((array[i].uuid && array[i].uuid === item.uuid) || (array[i].uid && array[i].uid === item.uid)) {
          curentItem = array[i]
          break
        }
      }
      index = array.indexOf(curentItem)
    }
    if (index > -1) {
      array.splice(index, 1)
    }
    if (callback) {
      callback(index)
    }
  },
  // 获取摘要
  getAbstracts: function (content, title) {
    content = this.stripHTML(content)
    let index = content.indexOf(title)
    index = index < 0 ? 0 : index
    return content.substring(index).substring(0, 150)
  },
  // 获取html文档中的Image标签
  getHtmlImageList: function (html) {
    var frag = document.createElement('div')
    frag.innerHTML = html
    var result = [].map.call(frag.querySelectorAll('img'), function (img) {
      if (img.attributes['src']) {
        return img.attributes['src'].value
      }
    })
    let urlImgList = []
    for (let i = 0; i < result.length; i++) {
      if (urlImgList.indexOf(result[i]) < 0) {
        urlImgList.push(result[i])
      }
    }
    return urlImgList
  },
  // 为关键字标记颜色red
  tagColor: (content, childStr) => {
    if (!content) {
      return ''
    }
    if (!childStr) {
      return content
    }
    let reg = new RegExp(`(${childStr})`, 'ig')
    let rstr = `<span style="color: red;font-size: 1.25em">${childStr}</span>`
    return content.replace(reg, rstr)
  },
  // 移除元素节点
  removeElement: (_element) => {
    var _parentElement = _element.parentNode
    if (_parentElement) {
      _parentElement.removeChild(_element)
    }
  },
  // 获取md5
  getMd5: (str) => {
    let md5 = crypto.createHash('md5')
    md5.update(str)
    return md5.digest('hex')
  },
  // 获取mac地址
  getMac: (callback) => {
    return ''
  },
  getOsMes: () => {
    return `${os.platform()}_${os.arch()}_${os.hostname()}`
  },
  // 获取sha1加密
  getSha1: (secret, str) => {
    return crypto.createHash('sha1').update(str).digest('hex')
  },
  // 获取字符串base64编码
  getBase64: (str) => {
    var b = new Buffer(str)
    var s = b.toString('base64')
    return s
  },
  // 创建目录
  mkdir: function (pos, dirArray, _callback) {
    var len = dirArray.length
    if (pos >= len || pos > 40) {
      _callback()
      return
    }
    var currentDir = ''
    for (var i = 0; i <= pos; i++) {
      if (i !== 0) {
        currentDir += '\\'
      }
      currentDir += dirArray[i]
    }
    fs.exists(currentDir, (exists) => {
      if (!exists) {
        fs.mkdir(currentDir, (err) => {
          if (err) {
            console.log('exist:' + currentDir)
          } else {
            this.mkdir(pos + 1, dirArray, _callback)
          }
        })
      } else {
        this.mkdir(pos + 1, dirArray, _callback)
      }
    })
  },
  mkdirs: function (dirpath, _callback) {
    var dirArray = dirpath.split('\\')
    fs.exists(dirpath, (exists) => {
      if (!exists) {
        this.mkdir(0, dirArray, () => {
          _callback()
        })
      } else {
        _callback()
      }
    })
  },
  getDirFiles: function (filePath, callback) {
    var resultfiles = []
    fs.readdir(filePath, function (err, files) {
      if (err) {
        console.warn(err)
        callback(err)
      } else {
        // 遍历读取到的文件列表
        if (files && files.length) {
          let errorNum = 0
          let successNum = 0
          files.forEach(function (filename) {
            // 获取当前文件的绝对路径
            var filedir = path.join(filePath, filename)
            // 根据文件路径获取文件信息，返回一个fs.Stats对象
            fs.stat(filedir, function (eror, stats) {
              if (eror) {
                errorNum++
                if (successNum + errorNum === files.length) {
                  callback(null, resultfiles)
                }
              } else {
                successNum++
                var isFile = stats.isFile() // 是文件
                if (isFile) {
                  resultfiles.push(filedir)
                  if (successNum + errorNum === files.length) {
                    callback(null, resultfiles)
                  }
                }
              }
            })
          })
        } else {
          callback(null, resultfiles)
        }
      }
    })
  },
  // html标签解码
  html_decode: function (str) {
    var div = document.createElement('div')
    div.innerHTML = str
    return div.innerText
  },
  // 清空文件夹
  emptyFolder: function (path) {
    var files = []
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path)
      files.forEach(function (file, index) {
        var curPath = path + '\\' + file
        if (fs.statSync(curPath).isDirectory()) { // recurse
          this.emptyFolder(curPath)
          console.log(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      })
    }
  },
  // 添加css class样式
  addClass: function (obj, cls) {
    var objClass = obj.className // 获取 class 内容.
    var blank = (objClass !== '') ? ' ' : '' // 判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    let added = objClass + blank + cls // 组合原来的 class 和需要添加的 class.
    obj.className = added
  },
  // 删除css class样式
  removeClass: function (obj, cls) {
    var objClass = ' ' + obj.className + ' '// 获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    objClass = objClass.replace(/(\s+)/gi, ' ') // 将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
    var removed = objClass.replace(' ' + cls + ' ', ' ') // 在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '') // 去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed
  },
  // 判断是否包含css class 样式
  hasClass: function (obj, cls) {
    var objClass = obj.className
    var objClassLst = objClass.split(/\s+/)
    let x = 0
    for (x in objClassLst) {
      if (objClassLst[x] === cls) {
        return true
      }
    }
    return false
  },
  // 对象深拷贝
  deepClone: function (obj) {
    var result = {}
    for (let key in obj) {
      result[key] = obj[key]
    }
    return result
  },
  // 更新一个数组里的一个数据
  updateArray: (array, val, isAdd) => {
    let currentItem = null
    let index = -1
    for (let i = 0; i < array.length; i++) {
      let item = array[i]
      if ((item.uuid && item.uuid === val.uuid) || (item.fromId && item.fromId === val.fromId) || (item.id && item.id === val.id)) {
        currentItem = item
        index = i
        break
      }
    }
    if (currentItem) {
      array.splice(index, 1, val)
    } else {
      if (isAdd) {
        array.push(val)
      }
    }
  },
  // 把一个对象换成另一个对象，相同属性赋值
  transObject2otherObject: function (objectSource, objectOther) {
    for (let attr in objectSource) {
      if (objectOther.hasOwnProperty(attr)) {
        objectOther[attr] = objectSource[attr]
      }
    }
    return this.deepClone(objectOther)
  },
  // 显示图片
  showImage (path, suffix) {
    if (suffix === 'jpg' || suffix === 'png') {
      return 'data:image/' + suffix + ';base64,' + fs.readFileSync(path).toString('base64')
    }
  },
  escape (val) {
    return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  },
  unescape (val) {
    return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  }
}
