import Mock from 'mockjs'
import { Base64 } from 'js-base64'
export default {
    getMenu: config => {
        console.log(JSON.parse(config.body))
        const{jobNumber, password}  = JSON.parse(config.body)
        console.log(jobNumber)
        console.log(password)
        // 先判断用户是否存在
        // 判断账号和密码是否对应
        console.log("解密：",Base64.decode(password))
        if (jobNumber === 'sadmin' && Base64.decode(password) === 'sadmin') {
            return {
                code: 1, //标记sysadmin  
                message: 'success',
                data: {
                    role:0,
                    token: Mock.Random.guid(),
                }
            }
        } else if (jobNumber === 'admin' && Base64.decode(password) === 'admin') {
            return {
                code: 1,
                message: 'success',
                data: {
                    role:1,
                    token: Mock.Random.guid(),
                }
            }
        } else if(jobNumber === '12345' && Base64.decode(password) === '1'){
            return{
                // code: 1,
                // message: 'success',
                // // data: {
                // //     role:2,
                // //     token: Mock.Random.guid(),
                    
                // // },
                // data: "eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoi6YeR5bq4IiwiaWQiOjEsInVzZXJuYW1lIjoiamlueW9uZyIsImV4cCI6MTY2MjIwNzA0OH0.KkUc_CXJZJ8Dd063eImx4H9Ojfrr6XMJyVzaWCVZCo"
                
                 code: 1,
                 msg: "success",
                 data: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoyLCJkZXB0Ijoi5YmN5Y-w5biC5Zy66JCl6ZSA6YOoIiwidXNlck5hbWUiOiLmnY7lm5siLCJqb2JOdW1iZXIiOiIyMDI0MDAwNCIsImV4cCI6MTcyMzAzMTgyOX0.Ccrv4FkCL3QYxpcJQfEEmaIO1rS8Qaav2PrgVhl-VN4"               

            }
        }
         else {
            return {
                code: 0,
                data: {
                    message: '密码错误'
                }
            }
        }

    }
}