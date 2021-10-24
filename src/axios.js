import Axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import { Message } from 'element-ui'
// import router from './router/index'

// 超时时间
// Axios.defaults.timeout = 5000
let instance = Axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求前处理
instance.interceptors.request.use(function (config) {
  // Do something before request is sentheader都加上token

  if (window.sessionStorage.token) { // 判断是否存在token，如果存在的话，则每个http
    config.headers.token = window.sessionStorage.getItem('token')
  }
  return config
}, error => {
  // 请求错误直接结束

  return Promise.reject(error)
})

// 请求后处理
instance.interceptors.response.use(response => {
  console.log(response)
  let code
  let message = ''
  if (/.*\/verifyUserName.*/.test(response.config.url)) {
    return response.data
  } else if (/.*\/verifyUserEmail.*/.test(response.config.url)) {
    return response.data
  } else {
    code = response.data.code
    message = response.data.msg
    if (code !== 200) {
      let err = {
        config: response.config,
        request: response.request,
        response: {
          data: {
            status: code + 10000,
            description: message
          }
        }
      }
      // 抛出错误
      errorhandler(err)
    } else {
      return response.data
    }
  }
}, errorhandler)

// 捕获错误
function errorhandler (error) {
  let err = {
    title: '未知错误',
    description: '系统发生未知的错误'
  }
  if (error.response) {
    // 发送请求后，服务端有返回x1
    // 1. HTTP返回的响应码不是 2xx
    // 2. 服务端自定义错误,服务端响应码不是 2xx
    // 3. 客户端自定义错误,返回的数据被定义为错误状态
    err = getErrorMessage(error)
  }
  let message = err.description
  // this.$message.error('错了哦，这是一条错误消息')
  Message.error(message)
  // 返回定义错误返回码
  return { 'code': 500 }
}

// 定义错误信息
function getErrorMessage (e) {
  let response = e.response.data

  let err = {
    title: '未知错误',
    description: '系统发生未知的错误'
  }
  if (e.response.status >= 400 && e.response.status < 500) {
    // 请求错误
    // 4xx 段错误提示
    err.title = '请求错误'
    // 响应状态码大于等于400
    switch (e.response.status) {
      case 404:
        err.description = '请求资源无法找到！！！'
        break
      case 401:
        err.description = '请求已拦截！！！'
        break
    }
  } else if (response.status >= 500 && response.status < 1000) {
    // 服务器端错误
    // 5xx 段错误提示
    err.title = '服务器错误'
    switch (response.status) {
      case 500:
        err.description = '服务器错误！！！'
        break
    }
  } else if (response.status >= 10000 && response.status < 30000) {
    // 自定义错误信息
    err.title = '===请求错误==='
    switch (response.status) {
      case 10500:
        err.description = response.description
        break
      case 10401:
        err.description = response.description
        // window.localStorage.clear()
        // router.push('/login')
        break
      case 10400:
        err.description = response.description
        break
    }
  }
  return err
}

Vue.use(VueAxios, instance)

Vue.prototype.$get = instance.get
Vue.prototype.$post = instance.post
window.$get = instance.get
window.$post = instance.post
// export default Axios
