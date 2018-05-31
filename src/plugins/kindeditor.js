/**
 * Created by Sind on 2017/3/17.
 */
// 加载kindeditor
require('./kindeditor/kindeditor-min')
require('./kindeditor/themes/default/default.css')
require('./kindeditor/themes/simple/simple.css')
require('./kindeditor/prettify.css')
require('./kindeditor/prettify')
require('./kindeditor/themes/default/kindeditordefault.css')
require('./kindeditor/zh_CN')
require('./kindeditor/plugins/code/code')
require('./kindeditor/plugins/link/link')
require('./kindeditor/plugins/table/table')
require('./kindeditor/plugins/insertImage/insertImage')
require('./kindeditor/plugins/quickformat/quickformat')
require('./kindeditor/plugins/lineheight/lineheight')

const path = require('path')
var prehtml = ''
// editorItems:界面显示功能菜单
// afterChange:文本发生改变时发生事件
// afterFocus:文本框获取焦点
// textAreaId:绑定的textAreaId
// uploadType:上传类型（Blog,Question）如需添加新项请在对应后端枚举中添加对应选项
var loadEditor = function (width, heigth, editorItems, afterChange, afterFocus, afterBlur, textAreaId, resizeType, uploadType) {
  KindEditor.lang({
    insertImage: '插入图片'
  })
  KindEditor.lang({
    wordupload: 'word文件发表',
    'wordupload.url': 'URL',
    'wordupload.title': '文件说明',
    'wordupload.upload': '浏览',
    'wordupload.viewServer': '文件空间'
  })
  if (editorItems === undefined) {
    editorItems = [
      'formatblock', 'fontname', 'fontsize', '|', 'code', 'insertImage', '|', 'justifyleft', 'justifycenter', 'justifyright',
      'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
      'superscript', '|', 'forecolor', 'hilitecolor', 'bold',
      'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'hr',
       'link', 'unlink', '|', 'source'
    ]
  }
  if (resizeType === undefined) {
    resizeType = 0
  }
  var editor = null
  var createKindEditor = function () {
    var options = {
      basePath: '../../plugins/kindeditor/',
      resizeType: resizeType,
      skinsPath: '../../plugins/kindeditor/themes/skins/',
      useContextmenu: true,
      filterMode: false,
      afterFocus: function () {
        if (afterFocus) {
          afterFocus()
        }
      },
      afterBlur: function () {
        if (afterBlur) {
          afterBlur()
        }
        this.sync()
      },
      afterChange: function (e) {
        if (afterChange !== undefined) {
          if (this.html() != prehtml) {
            afterChange()
            prehtml = this.html()
            this.sync()
          }
        }
      },
      afterCreate: function (e) {
        var editerDoc = this.edit.doc
        let self = this
        editerDoc.addEventListener('paste', function (e){
          var ele = e.clipboardData.items;
          for (var i = 0; i < ele.length; ++i) {
            if (ele[i].kind == 'file' && ele[i].type.indexOf('image/') !== -1) {
              var blob = ele[i].getAsFile();//得到二进制数据
              //创建表单对象，建立name=value的表单数据。
              var reader = new FileReader()
              reader.onload = function(event){
                var image = new Image();
                image.onload = function(){
                  var width = image.width;
                  var height = image.height;
                  self.exec('insertimage', event.target.result, 'image', width.toString(), height.toString());
                };
                image.src= event.target.result;
              }
              reader.readAsDataURL(blob)
            }
          }
        })
        // try {
        //   let bodyEle = document.querySelector('.ke-edit-iframe').contentWindow.document.body
        //   console.log('-----body----------', bodyEle)
        //   if (bodyEle.tagName.toLowerCase() === 'body') {
        //     let first = bodyEle[i].childNodes[0]
        //     console.log('first-----------------', first)
        //     let styleEle = document.createElement('style')
        //     styleEle.innerText = '::-webkit-scrollbar{width:5px; height:5px;}::-webkit-scrollbar-thumb:vertical{height:15px; background-color:rgba(0,0,0, 0.2);-webkit-border-radius:6px;}::-webkit-scrollbar-thumb:horizontal{width:15px; width:15px;background-color:rgba(0,0,0, 0.2);-webkit-border-radius:6px;}::-webkit-scrollbar-thumb:hover{background-color:rgba(0,0,0, 0.5)}::-webkit-scrollbar-thumb:active{background-color:rgba(0,0,0, 0.5)}::-webkit-scrollbar-thumb:window-inactive {background: rgba(0,0,0, 0.5)}'
        //     if (first) {
        //       bodyEle[i].insertBefore(styleEle, first)
        //       console.log('insert--------------', bodyEle[i])
        //     } else {
        //       bodyEle[i].appendChild(styleEle)
        //     }
        //   }
        // } catch (err) {
        //   console.log('---------------err---------', err)
        // }
      },
      minWidth: width,
      minHeight: heigth,
      // 编辑器高度
      width: width,
      // 编辑器宽度
      height: heigth,
      // 配置编辑器的工具栏
      items: editorItems,
      themeType: 'simple'
    }
    if (!textAreaId) {
      textAreaId = 'editorContent'
    }
    editor = KindEditor.create('#' + textAreaId, options) // 隐藏快捷的主题列表
    prettyPrint()
    return editor
  }
  return createKindEditor()
}

// uploadType:上传类型（Blog,Question）
export const loadWriteContentK = function (textAreaId, width, heigth, afterChange, afterFocus, afterBlur) {
  let editor = loadEditor(width, heigth, undefined, afterChange, afterFocus, afterBlur, textAreaId, undefined, 'note')
  let statuBar = document.querySelector('.ke-statusbar')
  statuBar.parentNode.removeChild(statuBar)
  return editor
}
