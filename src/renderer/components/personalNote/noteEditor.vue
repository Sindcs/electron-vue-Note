<template>
  <div style="width: 100%;height: 100%">
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
    props: ['propUuid']
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
