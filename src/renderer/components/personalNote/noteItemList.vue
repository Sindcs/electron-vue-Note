<template>
  <div class="noteItemCon" ref="noteItemCon" style="position: relative">
    <add-item @click="addNote"></add-item>
    <div class="tool">
      <div class="showMenu">
        <span style="padding-left: 10px">共{{count}}条</span>
        <span class="noteMe" :title="cataLogInfo.name">{{cataLogInfo.name}}</span>
        <span>正在显示{{itemList.length}}条</span>
      <p>
        <transition name="style1">
          <button v-show="isShowDele" class="button buttonDel" @click="deleteNote">删除选中笔记</button>
        </transition>
        <transition>
         <button v-show="isShowRecl" class="button buttonRecy" @click="deleteNote">将选中笔记移入回收站</button>
        </transition>
      </p>
      </div>
    </div>
    <div ref="noteListCon" class="noteListCon" >
      <scroll-page v-if="itemList.length !== 0" :isLoad="isLoad" :isGettingData="isGetPage" @scrollGetData="getNewData" style="height: 100%">
        <div slot="scrollContent">
          <docbase-item v-for="(item, index) in itemList" :quikDirType = "quikDirType" :item = "item" @deleteOne="deleteOne" @changBackColor="changBackColor">
            <note-item slot="item" :firstUuid="itemList[0].uuid" :item="item"></note-item>
          </docbase-item>
        </div>
      </scroll-page>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import noteItem from './noteItem.vue'
  import addItem from '../common/addItem.vue'
  import documentHelper from '../../common/documentHelper'
  import {cataLogType} from '../../model/enumtype'
  import docbaseItem from '../common/docbaseItem.vue'
  import {mapGetters} from 'vuex'
  import util from '../../common/util'
  import noteOperatore from '../../business/noteOperatore'
  import cataLogOperatore from '../../business/cataLogOperatore'
  import search from '../../business/search'
  import log from '../../foundation/log'
  import * as types from '../../vuex/mutation-types'
  import scrollPage from '../common/scrollPage.vue'
  import evenBus from '../../common/evenBus'

  export default {
    components: {
      noteItem,
      docbaseItem,
      scrollPage,
      addItem
    },
    data () {
      return {
        query: '',
        count: 0,
        isLoad: false,
        isGetData: false,
        isGetPage: false,
        firstUuid: '',
        delArr: [],
        cataLogInfo: {},
        pageIndex: 0,
        pageSize: 10,
        quikDirType: cataLogType.personalNote,
        reclArr: [],
        isChangItem: false,
        isShowDele: false,
        lastSelectItemDom: null,
        isShowRecl: false,
        itemList: []
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (util.startWith(from.path, to.path) && this.$store.state.base.isCurentItemClick && this.itemList.length) {
        this.$store.commit(types.CHANG_CURRENT_ROUTER, false)
        this.$router.push({ name: 'routerEditPerNote', params: { cataLogId: this.cataLogId, uuid: this.itemList[0].uuid } })
      } else {
        next()
      }
    },
    computed: {
      ...mapGetters([
        'themeColor',
        'searchInfo',
        'currentSelectDoc',
        'currentChangeNote',
        'currentSelectedItem',
        'currentExportItem'
      ])
    },
    mounted: function () {
      this.$nextTick(() => {
        this.cataLogId = this.currentSelectedItem.uuid
        // this.getNodeList(true)
      })
    },
    created () {
      evenBus.$on('moveSuccess', (doc) => {
        util.remove(this.itemList, doc)
      })
    },
    watch: {
      'currentSelectedItem': function (val) {
        this.cataLogId = val.uuid
        this.pageIndex = 0
      },
      'searchInfo': function (val) {
        this.itemList = []
        this.getNodeList(true)
      },
      'currentChangeNote': function (val) {
        util.updateArray(this.itemList, val)
      },
      'currentExportItem': function (val) {
        if (val.uuid === this.currentSelectedItem.uuid) {
          this.itemList = []
          this.getNodeList(true)
        }
      }
    },
    methods: {
      keydown (e) {
        if (e.keyCode === 13) {
          this.itemList = []
          this.filter(this.query)
        }
      },
      filter (keywords) {
        if (this.cataLogId) {
          search.searchNodeList(this.cataLogId, keywords).then(res => {
            for (let i = 0; i < res.length; i++) {
              res[i].title = util.tagColor(res[i].title, keywords)
              res[i].abstracts = util.tagColor(res[i].abstracts, keywords)
            }
            this.itemList = res
            this.router()
          }).catch(err => {
            console.log(err)
            log.writeErr(err)
          })
        }
      },
      changSelectStyle () {
        if (this.itemList.length !== 0) {
          if (this.lastSelectItemDom) {
            this.lastSelectItemDom.setAttribute('style', '')
          }
          this.$nextTick(() => {
            let nodeItemDom = this.$refs.noteItemCon
            if (noteItem && nodeItemDom) {
              let dom = nodeItemDom.querySelector('.noteItem')
              if (dom) {
                dom.setAttribute('style', 'background:rgba(0, 0, 0, 0.04);')
                this.lastSelectItemDom = dom
              }
            }
          })
        }
      },
      getNewData () {
        this.pageIndex++
        this.getNodeList()
      },
      loading (res) {
        this.isGetPage = false
        if (res.length !== 0) {
          if (this.pageIndex === 0) {
            this.itemList.push(...res)
          } else if (this.pageIndex > 0) {
            this.isLoad = true
            setTimeout(() => {
              this.itemList.push(...res)
              this.isLoad = false
            }, 100)
          }
        } else {
          this.isLoad = false
          if (this.pageIndex > 0) {
            this.pageIndex = this.pageIndex - 1
          }
        }
      },
      getNodeList (isReload) {
        if (this.isGetData) {
          return
        }
        this.isGetData = true
        if (isReload) {
          this.itemList = []
        }
        let cataLogId = this.cataLogId
        let queryParam = this.searchInfo.query
        if (cataLogId === cataLogType.personalNote) {
          cataLogId = ''
        }
        cataLogOperatore.getOneCataLogInfo(this.cataLogId).then(rs => {
          if (rs) {
            this.cataLogInfo = rs
          } else {
            this.cataLogInfo = {
              name: '[全部目录]'
            }
          }
        })
        noteOperatore.getByCatalogId(cataLogId, cataLogType.personalNote, queryParam, this.pageIndex, this.pageSize).then(res => {
          this.loading(res.nodes)
          this.isGetData = false
          this.count = res.totalCount
          if (isReload) {
            this.changSelectStyle()
            this.router()
          }
        }).catch(err => {
          this.isGetData = false
          console.log(err)
          log.writeErr(err)
        })
      },
      router () {
        if (this.itemList && this.itemList.length) {
          let item = this.itemList[0]
          let params = {uuid: item.uuid, quikDirType: cataLogType.personalNote, cataLogId: item.cataLogId}
          this.$router.push({name: cataLogType.personalNote + cataLogType.personalNote + 'Detail', params: params})
        }
        this.$emit('setCurrentList', this.itemList)
      },
      changBackColor (lastdom) {
        if (this.lastSelectItemDom) {
          this.lastSelectItemDom.setAttribute('style', '')
        }
        lastdom.setAttribute('style', 'background:rgba(0, 0, 0, 0.04);')
        this.lastSelectItemDom = lastdom
      },
      reSetCount () {
        this.count --
      },
      deleteNote () {
      },
      sort () {
        if (this.$refs.sortUl) {
          this.$refs.sortUl.classList.toggle('showSort')
        }
      },
      deleteOne (item) {
        util.remove(this.itemList, item)
        this.router()
        this.count --
        documentHelper.changCataLogDetail(this.currentSelectedItem)
      },
      addNote () {
        this.$router.push({name: 'routerNewPerNote', params: {cataLogItem: this.cataLogInfo, uuid: '-100', isEditor: true}})
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .noteItemCon {
    display: -webkit-flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: left;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    overflow: hidden;
  }
 .noteItemCon .tool{
   padding: 2px 4px 3px 4px;
    margin: 5px 0 0 0;
   user-select: none;
    border-bottom: 1px solid #ccc;
  }
  .deleteCon {
    position:absolute;
    top:40%;
    left:40px;
    z-index:20;
    display: block;
    width:50px;
    text-align: center;
    .icon1{
      font-size:45px;
      color: rgba(0, 0, 0, .4);
      &:last-child {
        font-size:40px;
      }
      &:hover{
        color:rgba(0, 0, 0, .6);
      }
    }
    .del{
      position:relative;
      &:hover{
        .delinfo {
          display: block;
        }
      }
    }
    .delinfo{
     position: absolute;
      left: 50px;
      top:12px;
      display: none;
      width:130px;
      padding:5px;
      color:#fff;
      background:rgba(0, 0, 0, .6) ;
    }
  }
  .topBox{
    position: relative;
    width: 100%;
    height:31px;
    line-height:27px;
    .search{
      position: relative;
      float:left;
      width:250px;
      height:28px;
      padding:0 5px;
      border:1px solid #999;
      background:#fff;
      text-align: left;
      border-radius: 5px;
      input{
        width:180px;
        height:23px;
        line-height:23px;
      }
      i{
        position: absolute;
        width:15px;
        right:5px;
        line-height:31px;
      }
    }
    .sort{
      float:right;
      height: 28px;
      box-sizing: border-box;
      padding-top: 2px;
      i{
        font-size: 20px;
        color:rgba(0,0,0,0.3);
        cursor:pointer;
        &:hover{
          color:#a18270
        }
        &:active{
          color:#a18270
        }
      }
      ul{
        position:absolute;
        right:0px;
        top:32px;
        z-index:101;
        display: none;
        padding:1px;
        text-align:left;
        border:1px solid #DBDBDD;
        box-shadow:4px 4px 2px -2px rgba(0, 0, 0, 0.4);
        background: #fff;
        li{
          a{
            display:block;
            padding:2px 10px;
            font-size:12px;
          }
          &:hover {
            background: $mainBackColor;
          }
          &:active {
            background: $mainBackColor;
          }
        }
      }
    }
  }
  .showMenu{
    margin: 8px 0 5px;
    font-size:13px;
    color:#000000;
    select: none;
    overflow: hidden;
    span{
      display: block;
      float: left;
      height:18px;
      line-height:18px;
    }
  }
  .showDel{
    height:25px;
    line-height: 25px;
  }
  .noteMe{
    width:75px;
    padding: 0 3px;
    margin:0 3px ;
    border:1px solid rgba(0,0,0,0.5);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .noteItemCon ::-webkit-input-placeholder {
    font-style:italic;
    font-size:11px;
    color:#333;
  }
  .selectStyle{
    background-color:rgba(132,160,123,0.1);
    border:none;
    box-shadow: 2px 2px 2px #ccc;
  }
  .showSort{
    display:block !important;
  }
  .noteListCon{
    -webkit-flex: 1;
    height: calc(100% - 70px);
  }
  @keyframes rotate{
    0%{
      transform:rotate(0deg);
    }
    100%{
      transform:rotate(180deg);
    }
  }

</style>
