<template>
  <div id='note'>
    <div class="noteLeft">
      <note-item-list></note-item-list>
    </div>
    <div class="noteRight">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import noteItemList from '../personalNote/noteItemList.vue'
  import noteEditor from '../personalNote/noteEditor.vue'
  import personalIndex from '../personalNote/index.vue'

  export default {
    components: {
      noteItemList,
      noteEditor,
      personalIndex
    },
    data () {
      return {
        list: []
      }
    }
  }
</script>

<style type="text/css">
  #note{
    display:-webkit-box;
    float: left;
    height: 100%;
    width: calc(100% - 280px)
  }
  .noteLeft {
    height: 100%;
    width: 290px;
  }
  .noteRight{
    height: 100%;
    width: calc(100% - 290px);
    -webkit-box-flex:1;
  }
</style>
