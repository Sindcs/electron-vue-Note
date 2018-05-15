<template>
  <li :style="item.styleClass">
    <a style="width:100%" @click.selef.2="newMenu">
      <span :class="isShow ? 'el-tree-node__expand-icon el-icon-caret-right expanded':'el-tree-node__expand-icon el-icon-caret-left'" v-if="item.childCount" @click.self="explain"></span>
      <span class ="nav-label"  @click="selectOne(item)">{{item.value}}</span>
    </a>
    <ul class ="collapse in tree-menu" v-if="isShow" style="padding-left: 20px">
      <sd-menu v-for="childItem in item.childList" :propItem="childItem" :key="childItem.key" v-on:selectOne="selectOne"></sd-menu>
    </ul>
  </li>
</template>

<script type="text/ecmascript-6">
  import cataLogOperatore from '../../business/cataLogOperatore'

  const { remote } = require('electron')
  const { Menu, MenuItem } = remote
  export default {
    name: 'sd-menu',
    data () {
      return {
        isShow: false
      }
    },
    props: ['propItem'],
    computed: {
      item: function () {
        return {
          key: this.propItem.key,
          value: this.propItem.value,
          childList: [],
          childCount: this.propItem.childCount
        }
      }
    },
    methods: {
      explain () {
        this.isShow = !this.isShow
        if (this.isShow) {
          cataLogOperatore.getOneAllChild(this.item.uuid, false).then((rows) => {
            this.item.childList = rows
          }).catch(err => {
            this.$alert({
              type: 'warn',
              message: '获取子目录失败:' + err
            })
          })
        }
      },
      selectOne (item) {
        this.$emit('selectOne', {key: item.key, value: item.value})
      },
      newMenu () {
        const noteRightMenu = new Menu()
        noteRightMenu.append(new MenuItem({
          label: '创建新目录',
          click: () => {
            this.$emit('newMenu', this.item)
          }
        }))
        noteRightMenu.popup(remote.getCurrentWindow())
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
