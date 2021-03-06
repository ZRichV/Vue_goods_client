import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//引入全局样式
import './assets/css/global.css'
// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//引入axios
import axios from 'axios'
//配置请求跟路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:3000/api/shop/'

axios.interceptors.request.use(config => {
        NProgress.start()
            // console.log(config)
            // 为请求头对象，添加token验证的Authorization字段
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 在最后必须 return config
        return config
    })
    // response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
        NProgress.done()
        return config
    })
    // 挂在到Vue实例，后面可通过this调用
Vue.prototype.$http = axios

Vue.config.productionTip = false
    // 组件全局注册 表格树
Vue.component('tree-table', TreeTable)
    // 全局注册富文本编辑器
Vue.use(VueQuillEditor)

// 月份在JS里面是从0开始的
// padStart补0
Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0');
    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')