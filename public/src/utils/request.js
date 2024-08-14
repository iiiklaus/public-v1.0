import axios from "axios";
import Cookie from 'js-cookie'
import { Message } from "element-ui";
import store from "../store";
// 封装一个axios实例
const http = axios.create({
    // 通用请求的地址前缀
    baseURL: '/',
    // 超时时间
    timeout: 100000
})

// 请求拦截器
http.interceptors.request.use(
    config => {
      // 从 Cookie 中获取 token
      const token = Cookie.get('token');
      if (token) {
        // 将 token 添加到请求头
        config.headers['Authorization'] = "Bearer "+ token;
      }+
      console.log("config:",config)
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

http.interceptors.response.use(
    response => response,
    error => {
      const { status } = error.response;
      if (status === 401) {
        Message({
          message: '认证失败，请重新登录',
          type: 'error',
          duration: 5 * 1000
        });
        Cookie.remove('token'); // 移除 token
        store.dispatch('user/resetToken').then(() => {
          location.reload();
        });
      } else {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        });
      }
      return Promise.reject(error);
    }
  );
  
export default http;
