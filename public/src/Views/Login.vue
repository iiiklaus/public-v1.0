<template>
    <div class="login-page">
    <el-form ref="form" class="login_container theBridge" :model="login" status-icon :rules="rules" label-width="70px">
        <h3 class="login_title">用户登录</h3>
        <el-form-item label="工号" prop="jobNumber">
            <el-input v-model="login.jobNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="login.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
            <el-radio-group v-model="login.role" class="role-selection">
                <el-radio label="0">系统管理员</el-radio>
                <el-radio label="1">管理员</el-radio>
                <el-radio label="2">客户经理</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button @click="submit" type="primary" style="margin-left:100px;margin-top:10px">登录</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import Cookie from 'js-cookie'
//import { Base64 } from 'js-base64'
import { getMenu } from '../api/index'
import {jwtDecode} from 'jwt-decode'
//import {sm2} from 'sm-crypto'
import {sm4} from 'sm-crypto'
export default {
    data() {
        return {
            // 登陆数据
            login: {
                jobNumber: '',
                password: '',
                role: '' // 添加角色字段
            },
            // 校验规则
            rules: {
                jobNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                role: [{ required: true, message: '请选择角色', trigger: 'change' }] // 添加角色校验
            }
        }
    },
    methods: {
        submit() {
            // 表单的校验
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 传入表单数据
                    //密码加密 需要的时候启动
                    //this.login.password= Base64.encode(this.login.password)
                    // 生成一个16字节的密钥（密钥需要和后端保持一致）
                    const key = "1234567890abcdef"
                    //const key1 = crypto.getRandomValues(new Uint8Array(16));
                    const key2= Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('');
                    console.log(key2)

                    // 使用 SM4 ECB 模式进行加密
                    this.login.password = sm4.encrypt(this.login.password, key2)
                    console.log("传给后端的密码",this.login.password) //表单数据 usename passwd role
                    console.log(this.login) //传给后端的表单数据
                    
                    getMenu(this.login).then((data) => {
                        console.log("后端返回的数据：",data)
                        if (data.data.code === 1) {
                            //在这里说明验证成功，现在来设置跳转页面。
                            const token=data.data.data //JWT
                            //解析JWT
                            const decoded=jwtDecode(token)
                            console.log("解析的jwt",decoded)
                            const role=decoded.role
                            const dept=decoded.dept
                            const usename=decoded.useName
                            const jobNumber=decoded.jobNumber
                            const exp=decoded.exp
                            //数据存在cookie里面
                            Cookie.set('role',role)
                            Cookie.set('usename',usename)
                            Cookie.set('jobNumber',jobNumber)
                            Cookie.set('dept',dept)
                            Cookie.set('exp',exp);
                            Cookie.set('token',token)
                            console.log("Cookie:",Cookie)
                            if(role=='0'){
                                this.$router.push('/user') //最后需要修改
                            }
                            else if(role=='1')
                            {
                                this.$router.push('/admin')
                            }
                            else{
                                console.log("现在需要进入客户经理页面")
                                this.$router.push('/manager')
                                console.log("这是login.vue的输出:",this.$router)
                            }
                            // 记录cookie
                            // Cookie.set('token', data.data.data.token)
                            // // 设置菜单
                            // this
                            // this.$store.commit('setMenu', data.data.data.menu)
                            // // 动态添加路由
                            // this.$store.commit('addMenu', this.$router)
                            // 根据角色跳转到相应首页
                            // if (this.login.role === 'sysadmin') {
                            //     this.$router.push('/sysadmin')
                            // } else if (this.login.role === 'admin') {
                            //     this.$router.push('/admin')
                            // } else if (this.login.role === 'manager') {
                            //     this.$router.push('/manager')
                            // }
                        } else {
                            // 验证失败的弹窗
                            this.$message.error(data.data.msg);
                        }
                    })
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login-page {
    height: 100vh;
    background-image: url('@/assets/background.png'); /* 请确保路径正确 */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login_container {
    background-color: #0c1622;
    margin: 100px auto;
    border-radius: 10px;
    box-shadow: 0 15px 25px 0 rgba(0, 0, 0, .6);

    width: 450px;
    border: 1px solid #f2f6fc;

    // 居中
    margin:  100px auto;

    padding: 70px 15px 15px 35px;

    // 让padding在width里面
    box-sizing: border-box;

    border-radius: 10px;
    background-color:  #0c1622;
    box-shadow: 0 0 25px #f2f2f5;

    .login_title {
        color: #284a6d;
        // 左右居中
        text-align: center;
        margin-bottom: 40px;
    }

    .el-input {
        width: 300px;
    }

    .role-selection {
        display: flex;
        justify-content: center;
    }
}

.theBridge {
  background:
    linear-gradient(227deg, #f7f2f272 50%, #e8eaee 100%),
    linear-gradient(155deg, rgba(243, 241, 241, 0.5) 5%, rgba(249, 246, 246, 0.5) 100%);
  background-blend-mode: multiply;
}

</style>
