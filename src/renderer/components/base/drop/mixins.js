/**
 * Created by Sind on 2017/10/12.
 */
import util from '../../../common/util'
import {cataLogType} from '../../../model/enumtype'
import * as types from '../../../vuex/mutation-types'

export default {
  data () {
    return {
      isDrop: false,
      files: [],
      currentItem: {}
    }
  },
  methods: {
    upload (isDrop) {
      if (this.currentSelectedItem.isMonitored) {
        this.$alert({
          title: '该文件夹不可这样操作'
        })
        return
      }
      if (isDrop !== true) {
        isDrop = false
      }
      let type = this.currentSelectedItem.type
      if (type === cataLogType.literatureDatum || type === cataLogType.thesisLiterature) {
        type = this.currentSelectedItem.type
      }
      this.$store.commit(types.CHANG_NEWDOC_DIALOG_STATE, {
        isExportShow: true,
        type: type,
        files: this.files,
        isDrop: isDrop
      })
    },
    getDropFiles (files) {
      let fileArray = []
      for (let i = 0; i < files.length; i++) {
        fileArray.push(files[i].path)
      }
      this.files = fileArray
      this.fileLoad(true)
    },
    fileLoad (isDrop) {
      if (this.files) {
        let item = util.deepClone(this.currentSelectedItem)
        if (!item.nodeType) {
          this.upload(isDrop)
          item = this.dialogSelectedItem
        } else {
          this.$store.commit(types.UPDATE_TASKLIST)
          this.$store.dispatch('importFile', {item: item, vue: this, files: this.files})
        }
      }
    }
  }
}
