<template>
  <div id="note-editor" style="height: 100%">
    <textarea :id="thisTextareaId" class="kindeditor-form-control">
    </textarea>
  </div>
</template>

<script type="text/ecmascript-6">
  import { loadWriteContentK } from '../../../plugins/kindeditor'
  import util from '../../common/util'

  export default {
    data: function () {
      return {
        hasChange: false,
        thisSetInterVal: -100,
        content: '',
        isNewNote: true,
        thisEditor: {},
        thisEditorDom: {},
        thisTextareaId: util.getUuid() + 'editor'
      }
    },
    props: ['noteContent'],
    mounted: function () {
      this.$nextTick(function () {
        this.thisEditor = loadWriteContentK(this.thisTextareaId, '100%', '100%', this.afterChange, this.afterFocus, this.afterBlur)
        this.thisEditorDom = document.getElementById(this.thisTextareaId)
        this.$emit('kindRead', this.thisEditor)
        this.init()
      })
    },
    watch: {
      'noteContent': function () {
        this.init()
      }
    },
    destroyed () {
      if (this.thisSetInterVal !== -100) {
        window.clearInterval(this.thisSetInterVal)
      }
    },
    methods: {
      init () {
        if (this.noteContent || this.noteContent === '') {
          this.content = this.noteContent
          this.isNewNote = true
          this.thisEditor.html(this.noteContent)
        }
      },
      afterChange () {
        if (this.isNewNote) {
          this.isNewNote = false
          this.$emit('changed')
        } else {
          this.$emit('changed')
          this.hasChange = true
        }
      },
      afterBlur () {
        if (this.thisSetInterVal !== -100) {
          window.clearInterval(this.thisSetInterVal)
          this.thisSetInterVal = -100
        }
      },
      afterFocus () {
        if (this.thisSetInterVal === -100) {
          this.thisSetInterVal = setInterval(() => {
            if (this.hasChange) {
              this.hasChange = false
              this.$emit('contentChange', this.thisEditorDom.value)
            }
          }, 5000)
        }
        this.$emit('focus')
      }
    }
  }
</script>
