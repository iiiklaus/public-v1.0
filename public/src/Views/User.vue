<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px">
      <common-aside/>
    </el-aside>
    <el-container>
      <el-header style="background-color: #545c64; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
        <el-button @click="handleMenu" icon="el-icon-menu" size="small"></el-button>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>用户管理页面</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <img class="user" src="https://via.placeholder.com/40" alt="user" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main style="padding: 0 20px;">
        <div class="tabs">
          <el-tag v-for="(item, index) in tags" :key="index" :closable="item !== '用户管理页面'" :type="item === '用户管理页面' ? 'success' : ''">
            {{ item }}
          </el-tag>
        </div>
        <div class="manage">
          <div class="manage-header">
            <el-button type="primary" @click="handleCreate">+ 新增</el-button>
            <el-dialog :title="modalType == 0 ? '新建' : '编辑'" :visible.sync="dialogVisible" width="50%" :before-close="closeDialog">
              <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="80px">
                <el-form-item label="姓名" prop="username">
                  <el-input placeholder="请输入姓名" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="工号" prop="jobNumber">
                  <el-input placeholder="请输入工号" v-model="form.jobNumber"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="dept">
                  <el-select v-model="form.dept" placeholder="请选择部门">
                    <el-option label="前台市场营销部" :value="1"></el-option>
                    <el-option label="中台风险控制部" :value="2"></el-option>
                    <el-option label="后台综合管理部" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                  <el-select v-model="form.role" placeholder="请选择角色">
                    <el-option label="管理员" :value="1"></el-option>
                    <el-option label="客户经理" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input placeholder="请输入密码" v-model="form.password"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
              </div>
            </el-dialog>
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="searchForm.jobNumber" placeholder="请输入用户工号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="common-table">
            <el-table :data="tableData" stripe style="width: 100%;">
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="jobNumber" label="工号"></el-table-column>
              <el-table-column prop="dept" label="部门">
                <template slot-scope="scope">
                  <span>{{ getDeptLabel(scope.row.dept) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="role" label="角色">
                <template slot-scope="scope">
                  <span>{{ getRoleLabel(scope.row.role) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pager" style="text-align: center; margin-top: 20px;" v-if="!searchForm.transactionID">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageData.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getUserList, createUser, deleteUser, updateUser,getUserById } from '../api/index';
import CommonAside from '../Views/UserComAside.vue';
import Cookie from 'js-cookie';

export default {
  components: { CommonAside },
  data() {
    return {
      form: {
        id: null,
        username: '',
        jobNumber:Cookie.get('jobNumber') ,
        dept: '',
        role: ''
      },
      rules: {
        username: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        jobNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        dept: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      dialogVisible: false,
      tableData: [],
      modalType: 0,
      pageData: {
        page: 1,
        pageSize: 20
      },
      total: 0,
      searchForm: {
        username: ''
      },
      tags: ['系统管理员页面']
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleMenu() {
      // 此处可实现侧边栏折叠逻辑
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.$router.push('/login');
      }
    },
    getList() {
      getUserList({ ...this.pageData, ...this.searchForm }).then(response => {
        console.log(response.data); // 打印返回的数据
        this.tableData = response.data.data.rows;
        this.total = response.data.data.total || 0;
      }).catch(error => {
        console.error("Error fetching users:", error);
      });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log("提交的表单数据:", this.form);
          if (this.modalType === 0) {
            createUser(this.form).then(() => {
              this.getList();
              this.$message({
              type: 'success',
              message: '添加成功!'
            })
            }).catch(error => {
              console.error("Error creating user:", error);
            });
          } else {
            if(this.form.password=='****')
            {
                delete this.form.password;
            }
            updateUser(this.form).then(() => {
              this.getList();
              this.$message({
              type: 'success',
              message: '更新成功!'
            })
            }).catch(error => {
              console.error("Error updating user:", error);
            });
          }
          this.closeDialog();
        }
      });
    },
    closeDialog() {
      //this.$refs.form.resetFields();
      this.dialogVisible = false;
    },
    handleEdit(row) {
      this.modalType = 1;
      this.form = { ...row ,
        password:'****'

      };
      
      this.openForm();
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser([row.id]).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
          console.error("Error deleting user:", error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCreate() {
      this.modalType = 0;
      this.form = {
        id: null,
        username: '',
        jobNumber: '',
        dept: '',
        role: ''
      };
      this.openForm();
    },
    openForm() {
      this.dialogVisible = true;
    },
    handleCurrentChange(page) {
      this.pageData.page = page;
      this.getList();
    },
    handleSizeChange(pageSize) {
      this.pageData.pageSize = pageSize;
      this.getList();
    },
    search() {
      const { jobNumber } = this.searchForm;
      console.log("用户",jobNumber)
      if (jobNumber) {
        getUserById(jobNumber).then((response) => {
          console.log("查询的返回:",response.data.data)
          // this.tableData = [response.data.list[0]]; mock模拟
          console.log(Array.isArray(response.data.data))
          this.tableData=[response.data.data] //根据后端修改的
          this.total = 1;
        }).catch(() => {
          this.tableData = [];
          this.total = 0;
        });
      } else {
        this.getList();
      }
    },
    getDeptLabel(dept) {
      switch (dept) {
        case 1: return '前台市场营销部';
        case 2: return '中台风险控制部';
        case 3: return '后台综合管理部';
        default: return '其他';
      }
    },
    getRoleLabel(role) {
      switch (role) {
        case 1: return '管理员';
        case 2: return '客户经理';
        default: return '系统管理员';
      }
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #545c64;
  color: white;
  padding: 0 20px;
  height: 60px;
}

.header-container .el-breadcrumb {
  margin-left: 20px;

  /deep/ .el-breadcrumb__inner,
  /deep/ .el-breadcrumb__separator {
    color: white;
  }
}

.header-container .el-dropdown-link {
  cursor: pointer;
  color: white;
}

.header-container .user {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.tabs {
  padding: 20px 20px 0 20px;
}

.tabs .el-tag {
  margin-right: 15px;
  cursor: pointer;
}

.manage {
  padding: 20px;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.common-table {
  position: relative;
}

.pager {
  text-align: center;
  margin-top: 20px;
}

.el-header {
  padding: 0;
}
</style>
