<template>
  <li class="menu-li" v-if="!isDelete">
    <a :style="item.styleClass" @contextmenu.prevent="newMenu" @click.self="router" :class="currentSelectCatalogItem.uuid === item.uuid ? 'selected':''">
      <span :class="isShow ? 'el-tree-node__expand-icon el-icon-caret-right expanded':'el-tree-node__expand-icon el-icon-caret-right'" v-if="item.childList && item.childList.length" @click.self="explain"></span>
      <span class ="nav-label"  @click="selectOne(item)">{{item.name}}</span>
    </a>
    <div v-if="isShowAdd">
      <new-cataLog-dialog @close="addClose" :parentInfo="item" :isEdit="isEdit"></new-cataLog-dialog>
    </div>
    <ul class ="tree-menu" v-if="isShow">
      <sd-menu v-for="childItem in item.childList" :propItem="childItem" :key="childItem.uuid"></sd-menu>
    </ul>
  </li>
</template>

<script type="text/ecmascript-6">
  import * as types from '../../store/mutation-types'
  import newCataLogDialog from '../cataLog/newCataLogDialog.vue'
  import cataLogOperatore from '../../business/cataLogOperatore'
  import documentOperatore from '../../business/documentOperatore'
  import {mapGetters} from 'vuex'

  const { remote } = require('electron')
  const { Menu, MenuItem } = remote
  export default {
    name: 'sd-menu',
    components: {
      newCataLogDialog
    },
    data () {
      return {
        isDelete: false,
        isShowAdd: false,
        isEdit: false,
        isShow: false
      }
    },
    props: ['propItem'],
    computed: {
      ...mapGetters([
        'currentSelectCatalogItem',
      ]),
      item: {
        get: function () {
        return {
          uuid: this.propItem.uuid,
          name: this.propItem.name,
          styleClass: `padding-left:${(this.propItem.cataLogChain.split('/').length) * 20}px`,
          childList: this.propItem.childList,
          childCount: this.propItem.childCount,
          cataLogChain: this.propItem.cataLogChain,
          type: this.propItem.type
        }
      },
      set: function (newval) {
         return newval
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
          uuid: this.item.uuid,
          name: this.item.name,
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
          label: '创建笔记',
          click: () => {
            this.$router.push({name: 'newNode', params:{ isEditor: true }})
          }
        }))
         noteRightMenu.append(new MenuItem({
          label: '修改目录名称',
          click: () => {
            this.isShowAdd = true
            this.isEdit = true
          }
        }))
         noteRightMenu.append(new MenuItem({
          label: '导入evenote笔记',
          click: () => {
            
          }
        }))
         noteRightMenu.append(new MenuItem({
          label: '修改目录名称',
          click: () => {
            this.isShowAdd = true
            this.isEdit = true
          }
        }))
        noteRightMenu.append(new MenuItem({
          label: '删除目录',
          click: () => {
            this.$confirm({
              message: '确认删除该目录?',
              onOk: () => {
                cataLogOperatore.deleteCatalog(this.item.uuid).then(() => {
                  this.$alert({
                    message: "删除成功！"
                  })
                  this.isDelete = true
               }).catch(err => {
                  this.$alert({
                    type: 'error',
                    message: `删除失败：该目录下存在笔记或子目录`
                  })
                  console.log(err)
                })
              }
            })
          }
        }))
        noteRightMenu.append(new MenuItem({
          label: '清空目录',
          click: () => {
            this.$confirm({
              message: '确定清空该目录?',
              onOk: () => {
                documentOperatore.deleteCatalogAllDocument(this.item.uuid, false).then(() => {
                  this.$alert({
                    message: '清楚完成！'
                  })
                }).catch(err => {})
                this.$alert({
                  message: '清空出现错误！',
                  type: 'error'
                })
              }
            })
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
      },
      router () {
        this.selectOne(this.item)
        this.$router.push({name: 'nodeIndex', params: {uuid: this.item.uuid}})
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
 .menu-li {
   a {
     cursor: pointer;
     height: 25px;
     padding: 1px 0px;
     line-height: 25px;
     font-weight: 400;
     display: block;
   }
   a:hover{
     background-color: rgb(80, 97, 109);
   }
   .tree-menu {
     font-size: 15px;
     a{
        height: 20px;
        line-height: 20px;
        font-family: "宋体";
        font-weight: 300;
        padding: 2px 0px;
     }
   }
   .selected {
     background-color: #4A5D6B
   }
 }
</style>
