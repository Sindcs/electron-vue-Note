<template>
  <ul class="toolBar">
    <li>
      <i class="el-icon-document"></i>
      全部笔记
    </li>
    <li>
      <i class="el-icon-refresh"></i>
      同步
    </li>
    <li>
      <i class="el-icon-upload2"></i>
      升级
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {

      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .toolBar {
    display: block;
    padding: 3px 10px;
    height: 30px;
    border: 2px #CCCCCC solid;
    border-left: 0px;
    border-right: 0px;
    line-height: 30px;
    font-family: "新宋体";
    li {
      padding: 0px 10px;
      float: left;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      i{
        font-size: 18px;
      }
    }
    li:hover{
      background-color: #EFE8D9;
    }
  }
</style>