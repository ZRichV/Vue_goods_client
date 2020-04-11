import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Register_Home" */ '../components/Login.vue' )
const Register = () => import(/* webpackChunkName: "Login_Register_Home" */ '../components/Register.vue' )

Vue.use(VueRouter)

  const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
]

const router = new VueRouter({
  routes
})

export default router
