<template>
  <div style="width: 100%;height: 100%">
    <div  :uuid="uuid" class='noteEditor' ref="noteEditor" v-show="isEditor">
      <div class="nodeheard">
        <input type="text" v-model="title" @click="click" placeholder="请输入笔记名...">
        <div style="padding:4px 4px; overflow:hidden;">
          <span class="noteMe" :title="cataLogName">{{cataLogName}}<i class="triangle"></i></span>
          <tag-item-list  class="tagList" :tagList="tagList" :uuid="uuid" @getFocus="getFocus"></tag-item-list>
          <div class="preShow edit" style="top:10px;">
            <span  @click="isEditor = !isEditor" v-show="isEditor" class="editNoteI">
              <i class="iconfont icon-shu" v-if="isEditor"></i>
            </span>
          </div>
        </div>
      </div>
      <drop @upload="upload" @dropUpload="getDropFiles" :isUnUsebale="false">
        <kineditor slot="contentText" style="-webkit-flex:1;" :noteContent="content" @contentChange="setSaveContent" class="bigEditor" @kindRead="kindRead" @changed="changed" @focus="kindFocus"></kineditor>
      </drop>
    </div>
    <div :uuid="uuid" class='notePreShow kindeditordefault ke-content1' ref="notePreShow" v-if="!isEditor">
      <div class="preShow edit" style="top:10px;right: 30px;">
        <span v-if="!isEditor" class="editNoteI" @click="isEditor = !isEditor" title="编辑"><i class="iconfont icon-biji2"></i></span>
      </div>
      <div style="position:relative">
      <note-scan :content.sync="showContent"></note-scan>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import documentHelper from '../../common/documentHelper'
  import tagItemList from '../common/tagItemList.vue'
  import kineditor from '../base/kindEditor.vue'
  import drop from '../base/drop/drop.vue'
  import noteScan from './noteScan.vue'
  import noteOperatore from '../../business/noteOperatore'
  import cataLogOperatore from '../../business/cataLogOperatore'
  import currentReadOperatore from '../../business/currentReadOperatore'
  import log from '../../foundation/log'
  import dialog from '../../common/dialog'
  import util from '../../common/util'
  import {mapGetters} from 'vuex'
  import * as types from '../../vuex/mutation-types'

  var cataLogType = require('../../model/enumtype').cataLogType

  export default {
    components: {
      tagItemList,
      kineditor,
      noteScan,
      drop
    },
    data () {
      return {
        item: {},
        title: '',
        tagList: [],
        content: '',
        saveContent: '',
        cataLogName: '',
        uuid: '',
        lastTitle: '',
        isCreatting: false,
        isFocus: false,
        isEditor: this.$route.params.isEditor,
        isTitleChange: true,
        kindEditor: {},
        thisOldCataLogItem: '',
        isChanged: false,
        kindFocused: false
      }
    },
    props: ['propUuid'],
    mounted: function () {
      let cataLogItem = this.$route.params.cataLogItem
      if (cataLogItem) {
        this.changeCataLogName(cataLogItem.uuid)
        this.thisOldCataLogItem = util.deepClone(cataLogItem)
      } else {
        this.changeCataLogName(this.currentSelectedItem.uuid)
        this.thisOldCataLogItem = util.deepClone(this.currentSelectedItem)
      }
      this.$nextTick(() => {
        this.getDetial(this.uuid)
        this.lastTitle = this.title
      })
    },
    beforeRouteUpdate (to, from, next) {
      next()
      if (this && this.isChanged && this.kindFocused) {
        this.click(this.thisOldCataLogItem)
      }
    },
    beforeDestroy () {
      if (this.isChanged && this.kindFocused) {
        this.click(this.thisOldCataLogItem)
      }
    },
    computed: {
      ...mapGetters([
        'themeColor',
        'currentSelectedItem',
        'searchInfo'
      ]),
      noteUuid: function () {
        if (this.propUuid) {
          this.uuid = this.propUuid
          return this.propUuid
        }
        let uuid = ''
        if (this.$route.params.uuid !== '-100') {
          uuid = this.$route.params.uuid
          this.uuid = uuid
        } else {
          uuid = ''
        }
        return uuid
      },
      cataLog: function () {
        let cataLogItem = this.$route.params.cataLogItem
        if (cataLogItem) {
          this.isFocus = false
          this.changeCataLogName(cataLogItem.uuid)
          this.thisOldCataLogItem = util.deepClone(cataLogItem)
        }
        return cataLogItem
      },
      showContent: function () {
        let content = this.saveContent ? this.saveContent : this.content
        let query = this.searchInfo.query
        if (query) {
          return util.tagColor(content, query.query)
        } else {
          return content
        }
      }
    },
    watch: {
      'noteUuid': function (val) {
        this.uuid = val
        this.saveContent = ''
        this.isFocus = false
        this.kindFocused = false
        this.getDetial(val)
      },
      'currentSelectedItem': function (val, oldVal) {
        if (val.type === cataLogType.personalNote) {
          this.isFocus = false
          this.changeCataLogName(val.uuid)
          this.thisOldCataLogItem = util.deepClone(val)
        }
      },
      'title': function (val) {
        if (this.isFocus) {
          this.saveTitle()
        }
      },
      'isEditor': function (val) {
        this.saveContent = this.kindEditor.html()
      }
    },
    methods: {
      kindRead (editor) {
        this.kindEditor = editor
      },
      // 更改目录名称
      changeCataLogName (uuid) {
        cataLogOperatore.getOneCataLogInfo(uuid).then(res => {
          if (res) {
            this.cataLogName = res.name
          } else {
            this.cataLogName = ''
          }
        }).catch(err => {
          log.writeErr(`noteEditor changeCataLogName error: ${err}`)
          console.log(err)
        })
      },
      // 获取一个笔记详细信息
      getDetial (uuid) {
        noteOperatore.getOneNote(uuid).then(res => {
          this.title = res.title.trim()
          currentReadOperatore.readOneDocument(uuid, res.cataLogType, this.title)
          this.content = util.isNullOrEmpty(res.content) ? '' : res.content
          this.item = res
          this.item.content = this.content
          this.tagList = res.tags
          this.cataLogName = res.cataLogName
        }).catch(err => {
          log.writeErr(`noteEditor getDetial error: ${err}`)
        })
      },
//      focus (e) {
//        this.isFocus = true
//        e.target.classList.add('inputFocus')
//      },
      click (catalogItem) {
        if (catalogItem) {
          if (!this.title) {
            this.setTitle()
          }
          this.save(catalogItem)
        } else {
          if (this.title && (this.title !== this.lastTitle)) {
            this.lastTitle = this.title
            this.saveTitle()
          } else if (!this.title && this.isChanged) {
            this.setTitle()
            // this.saveTitle()
            this.save(catalogItem)
          }
        }
      },
      setTitle () {
        let val = this.kindEditor.html()
        if (val) {
          let contentArray = val.replace(/<[^>]+>/g, '').split('\n')
          if (contentArray && contentArray.length > 0) {
            for (let i = 0; i < contentArray.length; i++) {
              let r = contentArray[i].replace(/(^\s*)/g, '').replace(/(\s*$)/g, '').replace(/(&nbsp;)+/g, '').replace(/[\t\f]/g, '')
              if (r) {
                this.title = r
                this.lastTitle = this.title
                break
              }
            }
          } else if (val.indexOf('<img') >= 0) {
            this.title = '我的图片'
            this.lastTitle = this.title
          }
        }
      },
      setSaveContent (val) {
        this.saveContent = val
        this.save()
      },
      saveTitle () {
        if (this.uuid && this.title) {
          noteOperatore.changTitle(this.uuid, this.title).then((rs) => {
            this.$store.commit(types.CHANGE_NOTE_ITEM, rs)
          }).catch((err) => {
            console.log(err)
            log.writeErr(`noteEditor saveTitle error: ${err}`)
          })
        }
      },
      save (catalogItem) {
        if (!this.isCreatting) {
          let catalogId = this.currentSelectedItem.uuid
          if (catalogItem && catalogItem.uuid) {
            catalogId = catalogItem.uuid
          }
          this.isCreatting = true
          let val = this.kindEditor.html()
          /* if (!val) {
            val = this.kindEditor.value
          } */
          if (this.title && val) {
            this.isChanged = false
            if (this.uuid) {
              var item = {
                content: val,
                abstracts: util.getAbstracts(val, this.title),
                title: this.title,
                cataLogId: catalogId
              }
              noteOperatore.changeNote(this.uuid, item).then(rs => {
                // this.content = rs.content
                this.isCreatting = false
                this.$store.commit(types.CHANGE_NOTE_ITEM, rs)
              }).catch(err => {
                console.log(err)
                this.isCreatting = false
                log.writeErr(`noteEditor save error: ${err}`)
              })
            } else {
              noteOperatore.addOneNote({
                content: val,
                author: '',
                source: '',
                sourceUrl: '',
                size: 0,
                title: this.title,
                abstracts: util.getAbstracts(val, this.title),
                tags: '',
                cataLogType: cataLogType.personalNote,
                cataLogId: catalogId
              }).then((note) => {
                this.uuid = note.uuid
                if (note.content) {
                  this.content = note.content
                }
                try {
                  if (catalogItem && catalogItem.uuid) {
                    documentHelper.changCataLogDetail(catalogItem)
                  } else {
                    documentHelper.changCataLogDetail(this.currentSelectedItem)
                  }
                } catch (err) {
                  console.log(err)
                }
                this.isCreatting = false
              }).catch(err => {
                this.isCreatting = false
                console.log(err)
                log.writeErr(`noteEditor save error: ${err}`)
              })
            }
          } else {
            this.isCreatting = false
          }
        }
      },
      getFocus () {
        this.$refs.noteEditor.querySelector('.tagInput').querySelector('.input').focus()
      },
      changed () {
        this.isChanged = true
      },
      kindFocus () {
        this.kindFocused = true
      },
//      blur (e) {
//        e.target.classList.remove('inputFocus')
//      },
      upload () {
        dialog.openFiles([], this.cataLogName).then(files => {
          console.log(files)
        }).catch(err => {
          console.log(err)
        })
      },
      getDropFiles (files) {
        console.log(files)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .noteEditor{
    width:100%;
    height:100%;
    overflow:hidden;
    display: -webkit-flex;
    flex-direction:column;
    &:hover{
      .edit{
        display: block;
      }
    }
  }
  .notePreShow {
    width:100%;
    height:100%;
    box-sizing: border-box;
    padding:10px;
    overflow: auto;
    font-size: 14px;
    display: block;
    text-align: left;
    &:hover{
      .edit{
        display: block;
      }
    }
  }
  .nodeheard input{
    font-size:15px;
    color: #666;
    font-weight: bold;
    height: 30px;
    margin:0 0 5px;
    width: 100%;
    padding-left:10px;
    text-align:left;
    &:focus{
      border-bottom:1px solid #ccc;
    }
  }
  ::-webkit-input-placeholder{
    color:#aaa;
    font-weight:normal;
    font-style: italic;
  }
  .nodeheard {
    width:100%;
    text-align: left;
  }
  .nodeheard input{
  }
  .noteMe {
    float:left;
    display:inline-block;
    max-width: 60px;
    height: 22px;
    margin: 0 3px;
    padding-right:7px;
    padding-left:7px;
    font-size:13px;
    line-height: 22px;
    border:1px solid rgba(0,0,0,0.5);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .triangle{
    position: absolute;
    top: 10px;
    right: 3px;
    z-index: 10;
    display: inline-block;
    height: 0;
    width: 0;
    vertical-align: middle;
    border-width: 4px 4px 0 4px;
    border-style: solid;
    border-color: rgba(0,0,0,0.4) transparent transparent;
  }
  .tagList{
    float:left;
    margin-top:2px;
  }
  .bigEditor .ke-edit{
    background: red !important;
  }
  .edit{
    display: none;
    animation: all 0.7s;
  }
  .preShow {
    position: absolute;
    z-index:100;
    right: 30px;
    top: 42px;
    cursor: pointer;
    font-size: 13px;
    i{
      font-size:13px;
    }
    &:hover{
      color: orangered;
    }
  }
  .ke-edit-iframe .ke-edit-textarea {
    min-width:700px;
    max-height:900px;
    margin:0 auto;
  }
  .editNoteI{
    display: block;
    width:40px;
    height:40px;
    border-radius:40%;
    background: orangered;
    color: #fff;
    line-height:40px;
    text-align: center;
    opacity:0.2;
    animation:all 0.6s;
    i{
      font-size:25px;
      color: #fff;
    }
    &:hover{
      opacity:0.8;
    }
  }
  /*.inputFocus{*/
    /*background:#f2f4f6;*/
  /*}*/
</style>
