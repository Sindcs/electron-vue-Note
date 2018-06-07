<template>
    <div class="noteItem" ref="noteItem"  :uuid="showItem.uuid" draggable="true" @dragstart="dragstart(showItem, $event)" @dragend="dragend" @click="router">
        <i class="icon3 iconfont icon-jiantou" title="笔记未同步..." v-if="item.isChanged"></i>
      <div class="wordDes">
        <i class="pen iconfont icon-Shape-copy"></i>
        <p class="title" v-html="showItem.title">
        </p>
        <div class="detailCon">
          <div class="deonscription">
            <p class="time">{{showItem.dateUpdated | getTime}}</p>
            <p v-html="showItem.abstracts"></p>
          </div>
          <div class="imageDes" v-if="showItem.imgSrc">
            <img :src="showItem.imgSrc | getNoteImage"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import * as types from '../../store/mutation-types'
  import {mapGetters} from 'vuex'
  import util from '../../common/util'

  export default {
    data () {
      return {
      }
    },
    props: ['item', 'firstUuid'],
    computed: {
      ...mapGetters([
        'searchInfo'
      ]),
      showItem: function () {
        let query = this.searchInfo.query
        if (query) {
          let reItem = util.deepClone(this.item)
          reItem.abstracts = util.tagColor(reItem.abstracts, query.query)
          reItem.title = util.tagColor(reItem.title, query.query)
          return reItem
        } else {
          return this.item
        }
      }
    },
    methods: {
      // 拖拽事件
      dragstart (item, e) {
        e.dataTransfer.effectAllowed = 'move'
        console.log(item)
        this.$store.commit(types.CHANG_DRAG_STATE, false)
        let text = item.uuid + ',' + item.cataLogType + ',' + item.cataLogId
        this.$store.commit(types.CHNAGE_DRAG_TARGET, item)
        this.$store.commit(types.SHOW_RECYCLE, true)
        e.dataTransfer.setData('text', text)
        let img = e.currentTarget.querySelector('.pen')
        e.dataTransfer.setDragImage(img, -15, -15)
        return true
      },
      dragend (e) {
        setTimeout(() => {
          if (this.$store.state.base.isdragSuccess) {
            this.$emit('deleteOne', this.item)
          }
          this.$store.commit(types.SHOW_RECYCLE, false)
        }, 1000)
        e.dataTransfer.clearData('text')
        this.eleDrag = null
        return false
      },
      router () {
        this.$router.push({name: 'nodeDetail', params: {uuid: this.item.uuid, isEditor: true}})
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/scss/common.scss';
.noteItem {
  position: relative;
  box-sizing: border-box;
  margin: 1px 4px;
  height: 100px;
  padding: 8px 15px;
  overflow: hidden;
  border-bottom: rgba(0,0,0,0.12) solid 1px;
  cursor: pointer;
  line-height:20px;
  color: #555;
  .icon3 {
    position: absolute;
    top: 2px;
    right: 3px;
    z-index: 2;
    font-size: 11px;
    color: orange;
  }
  &:hover {
    background: #E6E6E6;
  }
}
  .detailCon{
    width:100%;
    overflow: hidden;
    display:-webkit-flex;
    flex-direction: row;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    .deonscription {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      flex:1;
      height:50px;
      font-family: inherit;
      font-size:10px;
      letter-spacing:0.2px;
      line-height:18px;
      color:#657180;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
.wordDes{
  position: relative;
  overflow:hidden;
  .pen{
    position: absolute;
    left: 0;
    top:2px;
    margin-right:4px;
    font-size:15px;
  }
}
.wordDes .time{
  margin-bottom: 3px;
  line-height:14px;
  font-size:11px;
  color:#aaa;
}
.wordDes .title{
  display: block;
  width:100%;
  height:15px;
  font-size: 13px;
  padding-top:5px;
  line-height:15px;
  margin-bottom:5px;
  color:#464c5b;
  text-indent:20px;
  font-family:'Heiti';
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow:hidden;
}
.imageDes{
  width:70px;
  height:60px;
  margin-top:10px;
  text-align:right;
}
.imageDes img{
  width:60px;
  height:60px;
  vertical-align: middle;
}
</style>
