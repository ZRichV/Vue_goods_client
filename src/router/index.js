import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Register from '../components/Register.vue'

//路由懒加载
const Login = () =>
    import ( /* webpackChunkName: "Login_Register_Home" */ '../components/Login.vue')
const Register = () =>
    import ( /* webpackChunkName: "Login_Register_Home" */ '../components/Register.vue')
const Home = () =>
    import ( /* webpackChunkName: "Login_Register_Home" */ '../components/Home.vue')

const Users = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/user/User.vue')
const Rights = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/authority/Rights.vue')
const Roles = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/authority/Roles.vue')

const GoodsList = () =>
    import ( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
const GoodsAdd = () =>
    import ( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

const Params = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')
const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')

const Order = () =>
    import ( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
        path: '/home',
        component: Home,
        children: [
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/goods', component: GoodsList },
            { path: '/goods/add', component: GoodsAdd },
            { path: '/params', component: Params },
            { path: '/categories', component: Cate },
            { path: '/orders', component: Order }
        ]
    }
]

const router = new VueRouter({
    routes
})

//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
        // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router