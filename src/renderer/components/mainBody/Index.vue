<template>
  <div class="mainContent">
    <cataLog></cataLog>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import cataLog from '../cataLog/index.vue'

  export default {
    components: {
      cataLog
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .mainContent{
    height: calc(100% - 36px);
  }
</style>
