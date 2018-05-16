<template>
  <div class="note-content" v-html="content"></div>
</template>

<script type="text/ecmascript-6">
  const shell = require('electron').shell
  var $ = require('jquery')

  export default {
    data () {
      return {
      }
    },
    props: ['content'],
    mounted () {
      this.$nextTick(() => {
        window.prettyPrint()
        $('.note-content').on('click', 'a', function (e) {
          let url = $(this).attr('href')
          e.preventDefault()
          if (url) {
            shell.openExternal(url)
          }
        })
        $('.note-content').on('click', 'img', function (e) {
          let url = $(this).attr('src')
          e.preventDefault()
          if (url) {
            shell.openExternal(url)
          }
        })
      })
    },
    watch: {
      'content': function (val) {
        this.$nextTick(() => {
          window.prettyPrint()
        })
      }
    }
  }
</script>
