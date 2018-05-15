/**
 * Created by Sind on 2017/6/1.
 */
import { remote } from 'electron'
const dialog = remote.dialog

export default {
  // 打开文件
  openFiles: (extensions, cataLogName, singleSelect) => {
    if (!extensions) {
      extensions = ['doc', 'pdf', 'docx', 'ppt']
    }
    var options = {
      title: `导入到[${cataLogName}]`,
      properties: ['openFile', 'multiSelections'],
      filters: [{name: 'Files', extensions: extensions}]
    }
    if (singleSelect) {
      options.properties = ['openFile']
    }
    return new Promise((resolve, reject) => {
      dialog.showOpenDialog(options, (filePaths) => {
        if (typeof filePaths === 'undefined') {
          filePaths = []
        }
        resolve(filePaths)
      })
    })
  },
  // 打开目录
  openDirectory: () => {
    var options = {
      title: 'Select Directory',
      properties: ['openDirectory']
    }
    return new Promise(resolve => {
      dialog.showOpenDialog(options, (directroy) => {
        if (typeof directroy === 'undefined') {
          directroy = null
        }
        resolve(directroy)
      })
    })
  }
}
