import http from '../utils/request'


// 请求首页数据,直接把这个对象导出
// export const getData = () => {
//     // 返回一个promise
//     return http.get('/home/getData')
// }

// 查询
export const getTrans = (params) => {
    return http.get(`/transaction/page`,params)
}
// export const getTrans = (params) => {
//   console.log("params second",params)
//   return http.get(`/transaction/page?page=${params.pageData.page}&pageSize=${params.pageData.pageSize}`)
// }
//添加
export const createTrans = (data) => {
    console.log("index里面的创建",data)
    //return http.post(`/transaction/page?page=${data.pageData.page}&pageSize=${data.pageData.pageSize}&jobNumber=${data.jobNumber}`)
    return http.post("/transaction",data)
}
//删除
export const deleteTrans = (ids) => {
    //return http.delete(`/transaction/${ids}`, ids)
    console.log("index里面的ids:",ids)
    return http.delete(`/transaction/${ids}`)
}
//更新
export const updateTrans = (data) => {
    console.log("index里面的更新",data)
    return http.put('/transaction', data)
}
//根据交易ID查询
export const getbyID = (transactionID)=>{
    console.log("index里面的trans:",transactionID)
    return http.get(`/transaction/${transactionID}`)
}
export const getReportByTime = (params) => {
  console.log("index里面的report:",params)
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  console.log("拼接的url:",queryString)
    return http.get(`/transaction/page?$${queryString}`);
  };

export const getMenu = (data) => {
  console.log("我发起登录请求")
    return http.post('/login',data)
}


// // 请求首页数据,直接把这个对象导出
// export const getData = () => {
//     // 返回一个promise
//     return http.get('/home/getData');
//   }
export const getUserList = (params) => {
    return http.get('/users', { params });
    //return http.get( `/users?page=${params.pageData.page}&pageSize=${daparamsta.pageData.pageSize}`)
  }  
  
export const createUser = (userData) => {
    return http.post('/users', userData);
    //return http.post( `/users?page=${userData.pageData.page}&pageSize=${userData.pageData.pageSize}`)
  }
  
export const updateUser = (userData) => {
    return http.put('/users', userData);
  }
  
export const deleteUser = (ids) => {
    return http.delete(`/users/${ids.join(',')}`);
  }
  
export const getUserById = (id) => {
    return http.get(`/users/${id}`);
  }


//-----管理员界面接口------
//查询所有客户经理信息
export const getManagerList = (params) => {
  return http.get(`/transaction/managerPage`, params)
}

//获取当前客户经理的详细营销信息
export const getTransList = (params) =>{
  return http.get(`/transaction/Page`,params)
}

  

  