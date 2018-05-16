<template>
  <li class="menu-li">
    <a :style="item.styleClass" @contextmenu.prevent="newMenu">
      <span :class="isShow ? 'el-tree-node__expand-icon el-icon-caret-right expanded':'el-tree-node__expand-icon el-icon-caret-right'" v-if="item.childList && item.childList.length" @click.self="explain"></span>
      <span class ="nav-label"  @click="selectOne(item)">{{item.name}}</span>
    </a>
    <div v-if="isShowAdd">
      <new-cataLog-dialog @close="addClose" :parentInfo="item" :isEdit="isEdit"></new-cataLog-dialog>
    </div>
    <ul class ="collapse in tree-menu" v-if="isShow">
      <sd-menu v-for="childItem in item.childList" :propItem="childItem" :key="childItem.uuid"></sd-menu>
    </ul>
  </li>
</template>

<script type="text/ecmascript-6">
  import * as types from '../../store/mutation-types'
  import newCataLogDialog from '../cataLog/newCataLogDialog.vue'

  const { remote } = require('electron')
  const { Menu, MenuItem } = remote
  export default {
    name: 'sd-menu',
    components: {
      newCataLogDialog
    },
    data () {
      return {
        isShowAdd: false,
        isEdit: false,
        isShow: false
      }
    },
    props: ['propItem'],
    computed: {
      item: function () {
        return {
          uuid: this.propItem.uuid,
          name: this.propItem.name,
          styleClass: `padding-left:${(this.propItem.cataLogChain.split('/').length - 1) * 20}px`,
          childList: this.propItem.childList,
          childCount: this.propItem.childCount,
          cataLogChain: this.propItem.cataLogChain
        }
      }
    },
    methods: {
      explain () {
        this.isShow = !this.isShow
      },
      selectOne (item) {
        this.$store.commit(types.CHANGE_CURRENTSELECT_CATLOGITEM, {
          isShow: false,
          cataLogId: this.item.cataLogId,
          parentInfo: this.item
        })
      },
      newMenu () {
        const noteRightMenu = new Menu()
        noteRightMenu.append(new MenuItem({
          label: '创建新目录',
          click: () => {
            this.isShowAdd = true
            this.isEdit = false
          }
        }))
        noteRightMenu.append(new MenuItem({
          label: '修改目录名称',
          click: () => {
            this.isShowAdd = true
            this.isEdit = true
          }
        }))
        noteRightMenu.popup(remote.getCurrentWindow())
      },
      addClose (item) {
        this.isShowAdd = false
        if (item) {
          if (typeof item === 'string') {
            this.item.name = item
          } else {
            this.item.childList.push(item)
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
 .menu-li {
   a {
     cursor: pointer;
     font-size: 18px;
     height: 25px;
     padding: 2px 0px;
     font-weight: 400;
     display: block;
   }
   a:hover{
     background-color: #4A5D6B;
   }
 }
</style>
