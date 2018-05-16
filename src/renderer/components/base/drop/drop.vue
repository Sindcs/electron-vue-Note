<template>
  <div class='dropBox' @dblclick.self="click" title="双击或拖拽选择文件" ref="dropBox" @dragenter="dragenter" @dragleave="dragleave" @dragover="dragover" @drop="drop">
    <slot name="contentText"></slot>
  </div>
</template>

<script type='text/ecmascript-6'>

  export default {
    props: ['isUnUsebale'],
    methods: {
      dragenter (e) {
        this.$refs.dropBox.style.borderColor = 'gray'
        this.$refs.dropBox.style.backgroundColor = 'white'
        e.stopPropagation()
        e.preventDefault()
      },
      dragleave () {
        this.$refs.dropBox.style.backgroundColor = 'transparent'
      },
      dragover (e) {
        e.stopPropagation()
        e.preventDefault()
      },
      drop (e) {
        e.stopPropagation()
        e.preventDefault()
        this.handleFiles(e.dataTransfer.files)
      },
      handleFiles (files) {
        if (!this.isUnUsebale) {
          this.$emit('dropUpload', files)
        } else {
          this.$alert({
            title: '不可用',
            messageType: 'warning'
          })
        }
      },
      click () {
        if (!this.isUnUsebale) {
          this.$emit('upload', false)
        } else {
          this.$alert({
            title: '不可用',
            messageType: 'warning'
          })
        }
      }
    }
  }
</script>

<style type='text/css' scoped>
  .dropBox{
    min-width:300px;
    min-height:200px;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .dropBox:hover{
    /*border-radius: 10px;*/
  }
</style>
