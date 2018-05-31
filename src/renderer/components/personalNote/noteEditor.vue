<template>
  <div style="height: 100%">
    <div  :uuid="uuid" class='noteEditor' ref="noteEditor" v-show="isEditor">
      <div class="nodeheard">
        <input type="text" v-model="title" @click="click" placeholder="请输入笔记名...">
        <div style="padding:4px 4px; overflow:hidden;">
          <span class="noteMe" :title="cataLogName">{{cataLogName}}<i class="triangle"></i></span>
          <div class="preShow edit" style="top:10px;">
            <span  @click="isEditor = !isEditor" v-show="isEditor" class="editNoteI">
              <i class="iconfont icon-shu" v-if="isEditor"></i>
            </span>
          </div>
        </div>
      </div>
      <kineditor slot="contentText" style="-webkit-flex:1;" :noteContent="content" @contentChange="setSaveContent" class="bigEditor" @kindRead="kindRead" @changed="changed" @focus="kindFocus"></kineditor>
    </div>
    <div :uuid="uuid" class='notePreShow kindeditordefault ke-content1' ref="notePreShow" v-if="!isEditor">
      <div class="preShow edit" style="top:10px;right: 30px;">
        <span v-if="!isEditor" class="editNoteI" @click="isEditor = !isEditor" title="编辑"><i class="iconfont icon-biji2"></i></span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import kineditor from '../base/kindEditor.vue'
  import noteScan from './noteScan.vue'
  import noteOperatore from '../../business/noteOperatore'
  import log from '../../foundation/log'
  import util from '../../common/util'
  import dialog from '../../common/dialog'
  import {mapGetters} from 'vuex'
  
  var cataLogType = require('../../model/enumtype').cataLogType

  export default {
    components: {
      kineditor,
      noteScan
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
    computed: {
      ...mapGetters([
        'currentSelectCatalogItem',
      ])
    },
    mounted () {
      this.$nextTick(() => {
        var val = this.$route.params.uuid
        this.uuid = val
        this.saveContent = ''
        this.isFocus = false
        this.kindFocused = false
        this.getDetial(val)
      })
    },
    watch: {
      '$route.params.uuid': function (val) {
        this.uuid = val
        this.saveContent = ''
        this.isFocus = false
        this.kindFocused = false
        this.getDetial(val)
      }
    },
    methods: {
      // 获取一个笔记详细信息
      getDetial (uuid) {
        noteOperatore.getOneNote(uuid).then(res => {
          this.title = res.title.trim()
          this.content = util.isNullOrEmpty(res.content) ? '' : res.content
          this.item = res
          this.item.content = this.content
          this.tagList = res.tags
          this.cataLogName = res.cataLogName
        }).catch(err => {
          log.writeErr(`noteEditor getDetial error: ${err}`)
        })
      },
      kindRead (editor) {
        this.kindEditor = editor
      },
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
            // this.$store.commit(types.CHANGE_NOTE_ITEM, rs)
          }).catch((err) => {
            console.log(err)
            log.writeErr(`noteEditor saveTitle error: ${err}`)
          })
        }
      },
      save (catalogItem) {
        if (!this.isCreatting) {
          let catalogId = this.currentSelectCatalogItem.uuid
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
                // this.$store.commit(types.CHANGE_NOTE_ITEM, rs)
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
                    // documentHelper.changCataLogDetail(catalogItem)
                  } else {
                    // documentHelper.changCataLogDetail(this.currentSelectCatalogItem)
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .noteEditor{
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
    margin:0 0 1px;
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
