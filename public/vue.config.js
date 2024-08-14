// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,//对使用的JS 语法进行转译  不同版本使用不同
//   // 开启代理服务器，注意：这里的端口号写后端的端口号（方式一）
//   //简单代理服务器
//   devServer:{
//     port:8081,//当前前端服务器的端口号  不写默认是8080
    
//     proxy:"http://127.0.0.1:8080"//代理服务器
//   }
// })
module.exports = {
    lintOnSave: false,  // 如果为false，就是取消eslint规则的检查
    publicPath: './',
      assetsDir: 'static',
      productionSourceMap: false,
      devServer: {
          // 设置代理
          proxy: {
              '/': {
                  target: 'http://localhost:8080',
                  changeOrigin: true,
                  pathRewrite: {
                      '^/': ''
                  }
              }
          }
      }
  }