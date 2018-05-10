import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk'

Vue.use(Element)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$ajax = axios
Vue.config.productionTip = false

let elalert = Vue.prototype.$message
let alert = function (param) {
  if (param.type === 'error') {
    elalert({
      message: param.message,
      type: 'error'
    })
  } else if (param.type === 'warn') {
    elalert({
      message: param.message,
      type: 'warning'
    })
  } else if (param.type === 'info') {
    elalert({
      message: param.message,
      type: 'info'
    })
  } else {
    elalert({
      message: param.message,
      type: 'success'
    })
  }
}
let elConfirm = Vue.prototype.$confirm
let confirm = function (param) {
  elConfirm(param.message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (param.onOk) {
      param.onOk()
    }
  }).catch(() => {
    if (param.onCancel) {
      param.onCancel()
    }
  })
}
Vue.prototype.$alert = alert
Vue.prototype.$confirm = confirm

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
