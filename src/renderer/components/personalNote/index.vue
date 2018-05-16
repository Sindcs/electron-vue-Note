<template>
  <personalIndex v-if="type"></personalIndex>
  <div id='note' v-else>
    <div class="noteLeft">
      <note-item-list @setCurrentList="setCurrentList"></note-item-list>
    </div>
    <div class="noteRight" v-if="list.length">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import noteItemList from '../personalNote/noteItemList.vue'
  import noteEditor from '../personalNote/noteEditor.vue'
  import personalIndex from '../personalNote/index.vue'
  import {mapGetters} from 'vuex'

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
    },
    computed: {
      type: function () {
        return this.$route.params.type
      },
      ...mapGetters([
        'searchInfo',
        'currentSelectedItem',
        'currentChangeNote'
      ])
    },
    methods: {
      setCurrentList (val) {
        this.list = val
      }
    }
  }
</script>

<style type="text/css">
  #note{
    display:-webkit-box;
    width:100%;
    height: 100%;
  }
  .noteLeft {
    height: 100%;
    width: 290px;
  }
  .noteRight{
    height: 100%;
    -webkit-box-flex:1;
  }
</style>
