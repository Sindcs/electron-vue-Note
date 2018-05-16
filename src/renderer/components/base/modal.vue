<template>
  <div v-show="isShow" class="modal" :style="changeStyle" @click.self="clickMask" ref="modal">
    <div class="modal-dialog"   :class="{modalClass, 'dialog-enter-active': !isbigModal}" ref="dialog" :style="modalDialogStyle" @cancel="cancel" >
      <slot name="header">
        <moveItem>
          <div class="modal-header" slot="content">
            <h4 class="modal-title">
              <slot name="title">
                {{title}}
              </slot>
            </h4>
            <div class="cancelBtn" @click="cancel"></div>
          </div>
        </moveItem>
      </slot>
      <!--Container-->
      <div class="modal-body">
        <slot></slot>
      </div>
      <!--Footer-->
      <slot name="footer">
        <div class="modal-footer">
          <button type="button" :class="okClass" @click="ok" class="button themeSkin-back">{{okText}}</button>
          <button type="button" :class="cancelClass " @click="cancel" class="button themeSkin-back">{{cancelText}}</button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import moveItem from './moveItem.vue'

  export default {
    components: {
      moveItem
    },
    props: {
      isShow: {
        type: Boolean,
        twoWay: true,
        default: false
      },
      isbigModal: {
        type: Boolean,
        default: false
      },
      changeStyle: {
        type: String,
        default: ''
      },
      modalDialogStyle: {
        type: String,
        default: ''
      },
      backColor: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: 'Modal'
      },
      small: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      full: {
        type: Boolean,
        default: false
      },
      // 为true时无法通过点击遮罩层关闭modal
      force: {
        type: Boolean,
        default: false
      },
      // 自定义组件transition
      transition: {
        type: String,
        default: 'modal'
      },
      zIndex: {
        type: Number,
        default: 2000
      },
      // 确认按钮text
      okText: {
        type: String,
        default: '确定'
      },
      // 取消按钮text
      cancelText: {
        type: String,
        default: '取消'
      },
      // 确认按钮className
      okClass: {
        type: String,
        default: 'btn blue'
      },
      // 取消按钮className
      cancelClass: {
        type: String,
        default: 'btn red btn-outline'
      },
      // 点击确定时关闭Modal
      // 默认为false，由父组件控制prop.show来关闭
      closeWhenOK: {
        type: Boolean,
        default: false
      }
    },
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
        node: null,
        show: this.isShow
      }
    },
    computed: {
      modalClass () {
        return {
          'modal-lg': this.large,
          'modal-sm': this.small,
          'modal-full': this.full
        }
      }
    },
    created () {
      if (this.show) {
        document.body.className += ' modal-open'
      }
    },
    beforeDestroy () {
      document.body.className = document.body.className.replace(/\s?modal-open/, '')
    },
    watch: {
      show (value) {
        // 在显示时去掉body滚动条，防止出现双滚动条
        if (value) {
          document.body.className += ' modal-open'
        } else { // 在modal动画结束后再加上body滚动条
          if (!this.duration) {
            this.duration = window.getComputedStyle(this.$el)['transition-duration'].replace('s', '') * 1000
          }
          window.setTimeout(() => {
            document.body.className = document.body.className.replace(/\s?modal-open/, '')
          }, this.duration || 0)
        }
      }
    },
    methods: {
      ok () {
        this.$emit('ok')
        if (this.closeWhenOK) {
          this.show = false
        }
      },
      cancel () {
        this.$emit('cancel')
        this.show = false
      },
      // 点击遮罩层
      clickMask () {
        if (!this.force) {
          this.cancel()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .modal{
    position:fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
    outline: 0;
    display: -webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
  }
  .modal-dialog {
    position: relative;
    /*border-radius: 6px;*/
    outline: 0;
    border:1px solid #DBDBDD;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  }
  .modal-title {
    margin-bottom: 0;
    line-height: 1.5;
  }
  .modal-body {
    width: 100%;
    height: 100%;
  }
  .modal-header{
    position:relative;
    padding:8px 15px;
    font-size:13px;
    text-align:left;
    /*background-color: #fff;*/
    color:#f8f8f8;
    background:#555;
    border-bottom:1px solid #DBDBDD;
    overflow: hidden;
  }
  .modal-header h4{
    display: inline-block;
    /*color:#fff;*/
    font-weight:normal;
    letter-spacing: 1px;
  }
  /*.modal-header .close{*/
    /*display:inline-block;*/
    /*float:right;*/
    /*height:100%;*/
    /*width:40px;*/
    /*padding-left:5px;*/
    /*text-align:right;*/
    /*font-size:16px;*/
    /*cursor: pointer;*/
  /*}*/
  .modal-footer{
    padding: 0 15px 5px 15px;
    background:#fff;
    overflow:hidden;
    text-align:right;
    button{
      margin-bottom:15px;
    }
  }
  .dialog-enter-active{
    animation:dialog-in .5s;
  }
  @keyframes dialog-in {
    0% {
      opacity: 0;
      transform: rotateY(-90deg) translate3d(0, 30px, 0);
    }
    100% {
      opacity: 1;
      transform: rotate(0deg) translate3d(0, 0, 0);
    }
  }
  .modal-header .cancelBtn{
    float:right;
    margin-right:5px;
  }
  .modal-header .cancelBtn:after{
    background: #fff;
  }
  .modal-header .cancelBtn:before{
    background: #fff;
  }
</style>
