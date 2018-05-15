<template>
  <div>
    <ul>
      <sd-menu v-for="item in topMenuList" :key="item.key" :propItem="item"></sd-menu>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import sdMenu from '../base/menu.vue'

  export default {
    components: {
      sdMenu
    },
    data () {
      return {
        topMenuList: [
          {
            key: '1',
            value: '笔记本',
            childCount: 0
          }
        ]
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
