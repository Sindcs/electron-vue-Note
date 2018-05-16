<template>
  <div class="dropUpload">
    <drop @upload="upload" @dropUpload="getDropFiles" v-if="!isMonitored">
      <div slot="contentText" @dblclick="upload" class="contentText">
        <img src="../../../assets/img/drag.png"/>
      </div>
    </drop>
  </div>
</template>

<script type="text/ecmascript-6">
  import drop from './drop.vue'
  import {mapGetters} from 'vuex'
  import mixin from './mixins'

  export default {
    components: {
      drop
    },
    props: ['isMonitored'],
    mixins: [mixin],
    computed: {
      ...mapGetters([
        'currentSelectedItem',
        'dialogSelectedItem'
      ])
    }
  }
</script>

<style type="text/css" scoped>
  .dropUpload{
    width:100%;
    height:100%;
    box-sizing: border-box;
    text-align: center;
    background: #fff;
  }
  .contentText {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    -webkit-user-select: none;
    user-select: none;
  }
  .contentText img{
    position:absolute;
    top:50%;
    left:50%;
    margin-left:-150px;
    margin-top:-170px;
  }
</style>
