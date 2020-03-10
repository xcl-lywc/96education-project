import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引用公用css
import './assets/style/common.less'

// font-awesome
import 'font-awesome/css/font-awesome.css'

// Element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

// 引用公用js
import commonJS from "./js/common.js"
Vue.prototype.common = commonJS;

// 全局引入axios 并配置
import axios from 'axios'

// qs
import qs from 'qs'

import VideoPlayer from 'vue-video-player'
// require('video.js/dist/video-js.css')
require('vue-video-player/node_modules/video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.axios = axios;

/******************axios拦截器****************/
//request 拦截
Vue.prototype.axios.interceptors.request.use(
  (config, Vue) => {
    try {
      if(sessionStorage.getItem("Access-Token")) {
        config.headers.common['Access-Token'] = JSON.parse(sessionStorage.getItem("Access-Token") || null);
      }
      if(sessionStorage.getItem("Access-Key")) {
        config.headers.common['Access-Key'] = JSON.parse(sessionStorage.getItem("Access-Key") || null);
      }
    } catch(e) {
      console.log("获取Access-Token 或 Access-Key 有误!")
    }
    return config
  }, 
  error => {
    return Promise.reject(error)
  }
)
//response 拦截
Vue.prototype.axios.interceptors.response.use(
  response => {
    //请求成功的拦截
    // 当meta信息为空时，表示后台回传的文件流
    if(!response.data.meta) return response;

    if (response.data.meta.code != 0) { 

      if(response.data.meta.code == 401 || response.data.meta.code == 405) {
        setTimeout(() => {
          window.location.href = window.location.origin + "/web/login"
        }, 1500)
        return Promise.reject("登录验证失效, 请重新登录");
      } else if (response.data.meta.code == 403) {
        setTimeout(() => {
          window.location.href = window.location.origin + "/web/login"
        }, 2000)
        return Promise.reject("您的权限已被修改, 请重新登录");
      } else {
        return Promise.reject(response.data.meta.message)
      }
    } else {
      return response
    }
  }, 
  error => {
    if (error.response.data.message) {
      return Promise.reject(error.response.data.message)
    } else { //请求没有返回体, 请求失败
      return Promise.reject("网络错误, 请联系管理员");
    }
  }
);

new Vue({
  router,
  store,
  render: function (createElement) {
    let routeMeta = this.$route.meta
    let props = {}
    // 控制是否显示 带导航的布局 || 空白布局
    if (routeMeta && routeMeta.showNav) {
      props.layout = 'nav-layout'
    } else {
      props.layout = 'blank-layout'
    }
    return createElement(App, {props})
  }
}).$mount('#app')
