<template>
  <li :style="item.styleClass">
    <a style="width:100%">
      <span :class="isShow ? 'el-tree-node__expand-icon el-icon-caret-right expanded':'el-tree-node__expand-icon el-icon-caret-left'" v-if="item.childCount" @click.self="explain"></span>
      <span class ="nav-label"  @click="selectOne(item)">{{item.value}}</span>
    </a>
    <ul class ="collapse in tree-menu" v-if="isShow" style="padding-left: 20px">
      <sd-menu v-for="childItem in item.childList" :item="childItem" :key="childItem.key" :isSelectTop="isSelectTop" :isExpanAll="isExpanAll" v-on:selectOne="selectOne"></sd-menu>
    </ul>
  </li>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'sd-menu',
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      explain () {
        this.isShow = !this.isShow
        if (this.isShow) {

        }
      },
      selectOne (item) {
        this.$emit('selectOne',{key: item.key, value: item.value});
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
