import Vue from 'vue'
import Router from 'vue-router'
import Cookie  from 'js-cookie'
// import SysAdminHome from '@/views/SysAdminHome.vue'
// import AdminHome from '@/views/AdminHome.vue'
import manager from '../Views/manager.vue'
//import { component } from 'vue/types/umd'


Vue.use(Router)

const router = new Router({
    mode:'history',
    routes:[
        {
            path:'/',
            redirect:'/login',
        },
        {
            path:'/login',
            name:'Login',
            component:()=>import('../Views/Login.vue')
        },
        {
            path: '/manager',
            name: 'manager',
            component: manager,
            meta: { role: 2 }
        },
        {
            path:'/report',
            name:'Report',
            component:()=>import('../Views/Report.vue'),
            meta: { role: 2 }
        },
        {
          path:'/user',
          name:'User',
          component:()=>import('../Views/User.vue'),
          meta: { role: 0 }
      },
      {  // 管理员角色
        path:'/admin',
        name:'admin',
        component:()=>import('../Views/Admin.vue'),
        meta: { role: 1 }
      },
    ]
});

router.beforeEach((to, from, next) => {
    const token = Cookie.get('token');

   // let role = null;

    // if (token) {
    //     try {
    //     const decoded = jwtDecode(token);
    //     role = decoded.role;
    //     } catch (e) {
    //     console.error('Token decoding failed:', e);
    //     next('/login');
    //     return;
    //     }
    // }
    console.log("现在在beforeEach中")
    //const token = Cookie.get('token')
    const role = Cookie.get('role') ? parseInt(Cookie.get('role')) : null
    console.log("token",token,"role:",role)
    console.log(`Navigating to: ${to.path}`);
    if (to.path === '/login') {
      next()
    } else if (token && role !== null) {
      if (to.meta.role !== undefined && to.meta.role === role) {
        next()
      } else {
        next('/login')
      }
    } else {
      next('/login')
    }
  })
export default router