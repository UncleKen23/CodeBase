import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import Fastclick from 'fastclick'
import 'common/stylus/index.styl'

Vue.config.productionTip = false
Fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
