<template>
  <div @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" style="cursor: move">
    <slot name="content"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  var $ = require('jquery')

  export default {
    data () {
      return {
        duration: null,
        needMove: false,
        eWidth: 0,
        eHeight: 0,
        parentW: 0,
        parentH: 0,
        x: 0,
        // 鼠标与div的相对距离
        y: 0,
        node: null
      }
    },
    methods: {
      mouseDown (e) {
        this.nodep = $(e.target).parents('.modal')
        this.needMove = true
        this.node = $(e.target).parents('.modal-dialog')
        this.eWidth = this.node.width()
        this.eHeight = this.node.height()
        this.parentW = this.nodep.width()
        this.parentH = this.nodep.height()
        let left1 = this.node.offset().left
        let top1 = this.node.offset().top
        this.x = e.pageX - left1
        this.y = e.pageY - top1
        this.node.css({'position': 'absolute', 'top': top1, 'left': left1})
      },
      mouseMove (e) {
        if (this.needMove) {
          let positionleft = e.pageX - this.x
          let positiontop = e.pageY - this.y
          if (positionleft <= 50) {
            positionleft = 50
          }
          if (positiontop <= 40) {
            positiontop = 40
          }
          if (positionleft + this.eWidth > this.parentW) {
            positionleft = this.parentW - this.eWidth
          }
          if (positiontop + this.eHeight > this.parentH) {
            positiontop = this.parentH - this.eHeight
          }
          this.node.css('left', positionleft)
          this.node.css('top', positiontop)
        }
      },
      mouseUp (e) {
        this.needMove = false
        e.cancelBubble = true
      }
    }
  }
</script>
