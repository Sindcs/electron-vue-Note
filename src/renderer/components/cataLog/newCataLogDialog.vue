<template>
  <modal :title="operatorTitle" :isShow="!0" @cancel="cancel">
    <div style="padding: 15px 5px;text-align:left;overflow: auto;background: #fff;width: 330px">
      <el-input size="medium" :placeholder="placeholder" v-model="cataLogName"></el-input>
    </div>
    <div slot="footer">
      <div style="padding-bottom: 10px; padding-right: 10px; text-align: right; background-color: #ffffff">
        <el-button type="success" size="medium" @click="ok" plain>确定</el-button>
        <el-button type="info" size="medium" @click="cancel" plain>取消</el-button>
      </div>
    </div>
  </modal>
</template>

<script type="text/ecmascript-6">
  import log from '../../foundation/log'
  import cataLogOperatore from '../../business/cataLogOperatore'

  var enumType = require('../../model/enumtype')

  export default {
    data () {
      return {
        cataLogName: '',
        placeholder: '请输入目录名称...',
        operatorTitle: '新建目录'
      }
    },
    props: ['parentInfo', 'isEdit'],
    mounted () {
      this.$nextTick(() => {
        if (this.isEdit) {
          this.cataLogName = this.parentInfo.name
        }
      })
    },
    methods: {
      ok () {
        let name = this.cataLogName
        if (this.isEdit) {
          this.change(name)
        } else {
          this.add(name)
        }
      },
      cancel () {
        this.$emit('close')
      },
      add (name) {
        let parentInfo = this.parentInfo
        cataLogOperatore.addCatalog({
          name: name,
          isMonitored: 0,
          path: '',
          cataLogChain: `${parentInfo.cataLogChain ? parentInfo.cataLogChain : ''}/${parentInfo.uuid}`,
          type: parentInfo.type,
          parentCataLogId: parentInfo.uuid
        }).then((item) => {
          item.childList = []
          item.docNum = 0
          this.$emit('close', item)
        }).catch((err) => {
          this.$emit('close')
          if (err === enumType.statusCode.exist) {
            this.$alert({
              title: '添加失败',
              message: '已经存在同名的目录',
              messageType: 'error'
            })
          } else {
            log.writeErr(err)
            console.log(err)
          }
        })
      },
      change (name) {
        cataLogOperatore.getOneCataLogInfo(this.parentInfo.uuid).then(rs => {
          let parentCataLogId = rs.cataLogChain.substring(rs.cataLogChain.lastIndexOf('/') + 1)
          cataLogOperatore.updateCatalog(rs.uuid, name, parentCataLogId).then(() => {
            this.$emit('close', name)
          }).catch((err) => {
            if (err === enumType.statusCode.exist) {
              this.$alert({
                message: '已经存在同名的目录',
                type: 'error'
              })
            } else {
              console.log(err)
            }
            this.$emit('close')
          })
        }).catch(err => {
          this.$emit('close')
          console.log(err)
        })
      }
    }
  }
</script>
