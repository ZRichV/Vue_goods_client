import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue' )

Vue.use(VueRouter)

  const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

export default router
