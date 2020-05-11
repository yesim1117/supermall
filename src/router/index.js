import Vue from 'vue'
import VueRouter from 'vue-router'
// 懒加载
const Home = () => import('@/views/home/Home')
const Category = () => import('@/views/category/Category')
const Cart = () => import('@/views/cart/Cart')
const Profile = () => import('@/views/profile/Profile')
const Detail = () => import('@/views/detail/Detail')


Vue.use(VueRouter)

const routes = [
  {
    // 配置默认路由
    path: '',
    redirect: '/home'
  },
  {
    // 配置首页路由
    path: '/home',
    component: Home
  },
  {
    // 配置分类路由
    path: '/category',
    component: Category
  },
  {
    // 配置购物车路由
    path: '/cart',
    component: Cart
  },
  {
    // 配置我的路由
    path: '/profile',
    component: Profile
  },
  {
    // 配置详情页面路由
    path: '/detail/:iid',
    component: Detail
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router