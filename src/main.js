// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import './axios'
import store from './vuex/store.js'
import VueParticles from 'vue-particles'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
// import $ from 'jquery'
import animated from 'animate.css' // npm install animate.css --save安装，在引入
import echarts from 'echarts'
import './util/checkUtil'
import './util/format'
import 'babel-polyfill'

Vue.use(animated)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(router)
Vue.use(Vuex)
Vue.use(AMap)
Vue.use(AMapUI)
Vue.use(VueParticles)
// Vue.use($)
Vue.use(echarts)

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.clear()
  }
  let token = sessionStorage.getItem('token')
  if (!token && to.path !== '/login') {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
