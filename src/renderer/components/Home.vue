<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <el-button type="success" icon="el-icon-check" v-on:click="rebuild">重构指南数据</el-button>
        <el-button type="success" icon="el-icon-check" v-on:click="restore">还原数据</el-button>
      </div>
    </main>
  </div>
</template>

<script type="text/ecmascript-6">
  import util from '../common/util'
  import projectGuidOperator from '../business/projectGuidOperatore'

  var $ = require('jquery')
  var path = require('path')

  export default {
    name: 'landing-page',
    methods: {
      rebuild () {
        projectGuidOperator.getProjectList((err, list) => {
          if (err) {
            console.log(err)
            return
          }
          let myDate = new Date()
          var fileName = path.join(__dirname, `${myDate.getYear()}_${myDate.getMonth()}_${myDate.getDay()}_${myDate.getHours()}_${myDate.getMinutes()}.txt`)
          for (let node of list) {
            let contentHtml = `${node.HtmlContent}`
            node.HtmlContent = ''
            let $thisJq = null
            try {
              $thisJq = $(contentHtml)
            } catch (err) {
              $thisJq = $(`<div>${contentHtml}</div>`)
              console.log(err)
            }
            try {
              if ($thisJq) {
                for (var i = 0; i < $thisJq.length; i++) {
                  let $elemnet = $($thisJq[i])
                  if (util.removeStyle($elemnet)) {
                    node.HtmlContent += $elemnet.prop('outerHTML')
                  }
                }
                projectGuidOperator.updateProject(node.ID, node.HtmlContent, contentHtml, fileName)
              }
            } catch (err) {
              console.log(err)
            }
          }
          this.$alert({
            type: 'success',
            message: '操作成功！'
          })
        })
      },
      restore () {
        this.$alert({
          message: '有待完成！'
        })
      }
    }
  }
</script>

<style>
</style>
