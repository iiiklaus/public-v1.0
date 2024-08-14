<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px">
      <common-aside/>
    </el-aside>
    <el-container>
      <el-header style="background-color: #545c64; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
        <el-button @click="handleMenu" icon="el-icon-menu" size="small"></el-button>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>客户营销管理页面</el-breadcrumb-item>
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
        <!--头部下面的小方块内容，跳转不同角色，内容不一致-->
        <div class="tabs">
          <el-tag v-for="(item, index) in tags" :key="index" :closable="item !== '客户营销管理页面'" :type="item === '客户营销管理页面' ? 'success' : ''">
            {{ item }}
          </el-tag>
        </div>
        <div class="manage">
          <div class="manage-header">
            <el-button type="primary" @click="handleCreate">+ 新增</el-button>
            <el-dialog :title="modalType == 0 ? '新建' : '编辑'" :visible.sync="dialogVisible" width="50%" :before-close="closeDialog">
              <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="80px">
                <el-form-item label="客户姓名" prop="customerName">
                  <el-input placeholder="请输入客户姓名" v-model="form.customerName"></el-input>
                </el-form-item>
                <el-form-item label="交易日期" prop="transactionDate">
                  <el-date-picker 
                  type="date" 
                  placeholder="请选择交易日期" 
                  v-model="form.transactionDate" 
                  value-format="yyyy-MM-ddTHH:mm:ss"
                  :picker-options="{disabledDate:disableFutureDates}">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="产品类型" prop="productName">
                  <!-- <el-input placeholder="请输入产品类型" v-model="form.productName"></el-input> -->
                  <el-select v-model="form.productName" placeholder="请选择产品类型">
                    <el-option v-for="item in productOptions" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="交易金额" prop="transactionAmount">
                  <el-input placeholder="请输入交易金额" v-model="form.transactionAmount"></el-input>
                </el-form-item>
                <el-form-item label="营销进度" prop="marketingProgress">
                  <!-- <el-input placeholder="请输入营销进度" v-model="form.marketingProgress"></el-input> -->
                  <el-select v-model="form.marketingProgress" placeholder="请选择营销进度">
                    <el-option v-for="item in marketingOptions" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客户评分" prop="customerRating">
                  <el-input placeholder="请输入客户评分(1-5)" v-model="form.customerRating"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createdDate">
                  <el-date-picker 
                  type="date" 
                  placeholder="请选择创建时间" 
                  v-model="form.createdDate" 
                  value-format="yyyy-MM-ddTHH:mm:ss"
                  :picker-options="{disabledDate:disableFutureDates}">
                </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="更新时间" prop="updatedDate">
                  <el-date-picker 
                  type="date" 
                  placeholder="请选择更新时间" 
                  v-model="form.updatedDate" v
                  alue-format="yyyy-MM-ddTHH:mm:ss"
                  :picker-options="{disabledDate:disableFutureDates}">
                </el-date-picker>
                </el-form-item> -->
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
              </div>
            </el-dialog>
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="searchForm.transactionID" placeholder="请输入交易ID"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search(searchForm)">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="common-table">
            <el-table :data="tableData" stripe style="width: 100%;">
              <el-table-column prop="transactionID" label="交易ID"></el-table-column>
              <el-table-column prop="customerName" label="客户姓名"></el-table-column>
              <el-table-column prop="transactionDate" label="交易日期"></el-table-column>
              <el-table-column prop="productName" label="产品类型"></el-table-column>
              <el-table-column prop="transactionAmount" label="交易金额"></el-table-column>
              <el-table-column prop="marketingProgress" label="营销进度"></el-table-column>
              <el-table-column prop="customerRating" label="客户评分"></el-table-column>
              <el-table-column prop="createdDate" label="创建时间"></el-table-column>
              <el-table-column prop="updatedDate" label="更新时间"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="danger" @click="handleDelete(scope.row.transactionID)">删除</el-button>
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
import { getTrans, createTrans, deleteTrans, updateTrans,getbyID,getTrans_first} from '../api/index'
import CommonAside from '../components/CommonAside.vue';
import Cookie from 'js-cookie'

export default {
  components: { CommonAside },
  data() {
    return {
      form: {
        jobNumber:Cookie.get('jobNumber'),
        customerName: '',
        transactionDate: '',
        productName: '',
        transactionAmount: '',
        marketingProgress: '',
        customerRating: '',
        createdDate: '',
        // updatedDate: '',
      },
      rules: {
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        transactionDate: [{ required: true, message: '请选择交易日期', trigger: 'blur' }],
        productName: [{ required: true, message: '请输入产品类型', trigger: 'blur' }],
        transactionAmount: [{ required: true, message: '请输入交易金额', trigger: 'blur' }],
        marketingProgress: [{ required: true, message: '请输入营销进度', trigger: 'blur' }],
        customerRating: [{ required: true, message: '请输入客户评分', trigger: 'blur' }],
        createdDate: [{ required: true, message: '请选择创建时间', trigger: 'blur' }],
        // updatedDate: [{ required: true, message: '请选择更新时间', trigger: 'blur' }]
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
        transactionID: ''
      },
      productOptions: ['个人贷款', '信用卡', '储蓄账户', '投资理财', '房贷'],
      marketingOptions: [ '意向购买', '未成交', '成交'],
      tags: ['客户营销管理页面']   //需增加管理员页面名称
    }
  },
  methods: {
    disableFutureDates(time) {
      return time.getTime() > Date.now();
    },
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
      //查询信息
      getTrans({ params: { ...this.pageData, ...this.searchForm ,jobNumber: this.form.jobNumber } }).then((data) => {
        
        // this.tableData = data.data.list
        // this.total = data.data.count || 0
        this.tableData=data.data.data.rows  //根据后端响应修改的，上面是模拟
        this.total=data.data.data.total ||0
        console.log("data",data)
        console.log("table:",this.tableData)
      }).catch(error => {
        console.error("Error fetching manager", error);
      });
    },
    
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("提交的表单数据:", this.form);
          if (this.modalType === 0) { //表示为创建操作
            //console.log("之前是增加交易操作",this.form)
            createTrans(this.form).then(() => {
              //console.log("现在是增加交易操作",this.form)
              this.getList()
              this.$message({
              type: 'success',
              message: '添加成功!'
            })
            })
          } else {
            //console.log("之前现在是更新交易操作",this.form)
            updateTrans(this.form).then(() => {//表示为更新操作
              //console.log("现在是更新交易操作",this.form)
              this.getList()
              this.$message({
              type: 'success',
              message: '更新成功!'
            })
            })
          }
          this.closeDialog()
        }
      })
    },
    closeDialog() {
      //this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    handleEdit(row) {
      this.modalType = 1
      this.form = { ...row }
      this.openForm()
    },
    handleDelete(transactionID) {
      this.$confirm('此操作将永久删除该交易, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("当前在删除操作,交易ID:",transactionID)
        deleteTrans( transactionID ).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCreate() {
      this.modalType = 0
      // 重置表单数据
      this.form = {
        jobNumber: Cookie.get('jobNumber'),
        customerName: '',
        transactionDate: '',
        productName: '',
        transactionAmount: '',
        marketingProgress: '',
        customerRating: '',
        createdDate: '',
        // updatedDate: '',
      }
      this.openForm()
    },
    openForm() {
      this.dialogVisible = true
    },
    handleCurrentChange(page) {
      this.pageData.page = page
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.pageData.pageSize = pageSize
      this.getList()
    },
    // search() {
    //   this.getbyID(transactionID)
    //   //this.getList()
    // }
    search() {
      const { transactionID } = this.searchForm;
      console.log("交易ID",transactionID)
      if (transactionID) {
        getbyID(transactionID).then((response) => {
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
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
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