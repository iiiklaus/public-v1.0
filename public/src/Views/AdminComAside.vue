<template>
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <h3>{{ isCollapse ? "后台" : "营销监测后台管理系统" }}</h3>
      <el-menu-item index="1" @click="navigateTo('/admin')">
        <i class="el-icon-menu"></i>
        <span slot="title">管理界面</span>
      </el-menu-item>
    </el-menu>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      navigateTo(path) {
        if (this.$route.path !== path) {
          this.$router.push(path);
        }
      }
    },
    computed: {
      ...mapState({
        isCollapse: state => state.tab.isCollapse
      })
    }
  };
  </script>
  
  <style lang="less" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    background-color: #2c3e50; /* 设置导航栏背景色 */
  }
  
  .el-menu {
    height: 100vh;
    border-right: none;
    background-color: #2c3e50; /* 设置导航栏背景色 */
    color: #ffffff; /* 设置字体颜色为白色 */
  
    .el-menu-item {
      color: #ffffff; /* 设置字体颜色为白色 */
    }
  
    h3 {
      text-align: center;
      line-height: 48px;
      color: #ffffff; /* 设置字体颜色为白色 */
      font-size: 16px;
      font-weight: 400;
      background-color: #2c3e50; /* 设置导航栏背景色 */
    }
  }
  </style>
  