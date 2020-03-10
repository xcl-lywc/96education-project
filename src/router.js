import Vue from 'vue'
import Router from 'vue-router'

// 登录
const Login = () => import('./view/Login.vue')

// 注册
const Reg = () => import('./view/Reg.vue')

// 首页
const Home = () => import('./view/Home.vue')

//用户管理
const PersonManageIndex = () => import("./view/personManage/Index.vue");
const UserList          = () => import("./view/personManage/UserList.vue");
const RoleList          = () => import("./view/personManage/RoleList.vue");

//系统设置
const SystemManageIndex = () => import("./view/systemSet/Index.vue");
const SystemSet          = () => import("./view/systemSet/SystemSet.vue");

//我的接单
const OrderManageIndex = () => import("./view/myOrder/Index.vue");
const MyOrder          = () => import("./view/myOrder/MyOrder.vue");

//家教信息广场
const HomeInfoManageIndex = () => import("./view/homeInfo/Index.vue");
const HomeInfo          = () => import("./view/homeInfo/HomeInfo.vue");

Vue.use(Router)

export default new Router({
  mode: "history",
  base: "/web/",
  routes: [
    // 设置默认进入页面
    {
      path: '*',
      redirect: '/login', 
    },
    // 登录
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        showNav: false
      }
    },
    // 注册
    {
      path: '/reg',
      name: 'Reg',
      component: Reg,
      meta: {
        showNav: false
      }
    },
    // 首页
    {
      path: '/home',
      name: 'Home',
      component: Home,
      navName: '首页',
      meta: {
        showNav: true
      },
      children: []
    },
    // 用户管理
    {
      path: '/person',
      name: 'PersonManageIndex',
      component: PersonManageIndex,
      navName: '用户管理',
      meta: {
        showNav: true
      },
      children: [
        {path: "userlist", name: "UserList", navName: '用户列表', component: UserList, meta: { showNav: true }},
				{path: "rolelist", name: "RoleList", navName: '角色列表', component: RoleList, meta: { showNav: true }},
      ]
    },
		// 系统设置
		{
		  path: '/system',
		  name: 'SystemManageIndex',
		  component: SystemManageIndex,
		  navName: '系统管理',
		  meta: {
		    showNav: true
		  },
		  children: [
		    {path: "systemset", name: "SystemSet", navName: '系统设置', component: SystemSet, meta: { showNav: true }},
		  ]
		},
		// 用户管理
		{
		  path: '/order',
		  name: 'OrderManageIndex',
		  component: OrderManageIndex,
		  navName: '接单管理',
		  meta: {
		    showNav: true
		  },
		  children: [
		    {path: "myorder", name: "MyOrder", navName: '我的接单', component: MyOrder, meta: { showNav: true }},
		  ]
		},
		// 用户管理
		{
		  path: '/homeinfo',
		  name: 'HomeInfoManageIndex',
		  component: HomeInfoManageIndex,
		  navName: '家教信息广场',
		  meta: {
		    showNav: true
		  },
		  children: [
		    {path: "homeinfo", name: "HomeInfo", navName: '家教信息广场', component: HomeInfo, meta: { showNav: true }},
		  ]
		},
  ]
})
