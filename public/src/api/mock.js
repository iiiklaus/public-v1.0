import Mock from 'mockjs'
import homeMock from '../api/mockServe/home'
import user from './user'
import permission from './mockServe/permission'
import transaction from './transaction';



// 定义mock拦截
Mock.mock('/api/home/getData',homeMock)

// 用户管理:增删查改
Mock.mock(/\/api\/user\/get/,user.getUserList)
Mock.mock('/api/user/create','post',user.createUser)
Mock.mock('/api/user/update','post',user.updateUser)
Mock.mock('/api/user/del','post',user.deleteUser)
Mock.mock('/api/user/getid', 'get', user.getTransactionById);
Mock.mock(/\/transaction\/page/, 'post', transaction.getReportByTime);


// 登录权限
Mock.mock(/api\/permission\/getMenu/,'post',permission.getMenu)