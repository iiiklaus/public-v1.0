<template>
  <el-container style="height: 100vh;">
    <!--侧边栏-->
    <el-aside width="200px">
      <common-aside/>
    </el-aside>
    <el-container>
      <!--顶部区域-->
      <el-header style="background-color: #545c64; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
        <el-button @click="handleMenu" icon="el-icon-menu" size="small"></el-button>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>客户经理管理页面</el-breadcrumb-item>
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
          <el-tag v-for="(item, index) in tags" :key="index" :closable="item !== '客户经理管理页面'" :type="item === '客户经理管理页面' ? 'success' : ''">
            {{ item }}
          </el-tag>
        </div>
        <div class="manage">
          <div class="manage-header">
            <div class="left-section">
                <!-- 搜索框 -->
                <el-input inline v-model="searchText" placeholder="请输入客户经理姓名" style="width: 200px;"></el-input>
                <!-- 搜索按钮 -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <div class="right-section">
              <!-- 主页导出按钮 -->
              <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
            </div>
          </div>
          <div class="common-table">
            <!--table表格和一些查看弹出的代码信息-->
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="jobNumber" label="工号"></el-table-column>
              <el-table-column prop="managerName" label="姓名"></el-table-column>
              <el-table-column prop="salesVolume" label="销售总额"></el-table-column>
              <el-table-column prop="salesGrowth" label="销售增长率"></el-table-column>
              <el-table-column prop="newCustomersNum" label="新客户开发"></el-table-column>
              <el-table-column prop="churnRate" label="客户流失率"></el-table-column>
              <el-table-column prop="satisfaction" label="客户满意度"></el-table-column>
              <!-- 自定义列 -->
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleCheck(scope.row)">查看</el-button>
                </template>
            </el-table-column>
            </el-table>
            <!--点击页面弹出的dialog-->
            <el-dialog :visible.sync="dialogTableVisible" width="70%" :close-on-click-modal="false" :title="dialogTitle">
              <div class="dialogHeader">
                <!--选择的时间范围-->
                <el-date-picker v-model="dateRange" type="daterange" format="yyyy-MM-dd" align="right" placeholder="选择时间范围"></el-date-picker>
                <!--导出详情信息的按钮-->
                <el-button type="primary" icon="el-icon-download"  @click="handleTransExport"
                style="margin: 5px;"></el-button>
              </div>
              <div class="dialogBody">
                <el-table :data="transactionData"  stripe style="width: 100%" class="user-details-table"> 
                    <el-table-column prop="transactionID" label="交易号"></el-table-column>
                    <el-table-column prop="customerName" label="客户姓名"></el-table-column>
                    <el-table-column prop="transactionDate" label="交易日期"></el-table-column>
                    <el-table-column prop="productName" label="产品类型"></el-table-column>
                    <el-table-column prop="transactionAmount" label="交易金额"></el-table-column>
                    <el-table-column prop="marketingProgress" label="营销进度"></el-table-column>
                    <el-table-column prop="customerRating" label="客户评分"></el-table-column>
                    <el-table-column prop="createdDate" label="创建时间"></el-table-column>
                    <el-table-column prop="updatedDate" label="更新时间"></el-table-column>
                </el-table>
              </div>
            </el-dialog>
          </div>
          <!-- 主页面的分页 -->
          <div class="pager" style="text-align: center; margin-top: 20px;">
              <el-pagination
                background 
                @size-change="handleSizeChange"
                @current-change="handleMainPageChange"
                :current-page="pageData.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
          </div>
        </div>
        <!--添加测试按钮，点击后发送请求,测试是否成功发送请求
        <div>
          <el-button type="primary" @click="sendRequest">发送请求</el-button>
        </div>-->
        
      </el-main>
    </el-container>
  </el-container>
</template>
    
<script>
import CommonAside from './AdminComAside.vue';
import Cookie from 'js-cookie';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { getManagerList, getTransList } from '../api/index'
export default{
  //组件
  components:{CommonAside},
  //返回的数据
  data(){
    return{
      managerForm:{
        jobNumber:'',
        managerName:'',
        salesVolume:'',
        salesGrowth:'',
        newCustomersNum:'',
        churnRate:'',
        satisfaction:''   
      },
      transactionForm: {
        transactionID: '',
        customerName: '',
        transactionDate: '',
        productName: '',
        transactionAmount: '',
        marketingProgress: '',
        customerRating: '',
        createdDate: '',
        updatedDate: '',
        customerManagerID:null
      },
      searchText: '',       // 搜索框的关键字
      tableData: [], //主页面所有客户经理存放的table数据
      originalTableData: [], // 用来存储最初的表格数据
      transactionData: [], // 每一个客户经理的信息存放在一行，点击查看能看到该客户经理的详细营销交易信息
      // 主页分页
      pageData: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      administratorID: Cookie.get('jobNumber'), //根据登陆传递的工号得到管理员的id
      dateRange: [], // 用于存储用户选择的时间范围
      dialogTableVisible: false, // 控制 dialog 的显示与隐藏
      dialogTitle: '', // dialog 的标题
      tags:['客户经理管理页面'],
      transFileName:'' //交易信息文件名
    }
  },
  //方法
  methods:{
    sendRequest(){
      getManagerList({ params: { ...this.pageData, administratorID: this.administratorID } })
      .then((data) => {
        console.log("发送请求成功！")
        console.log('请求成功:', data.data);
        alert('请求成功: ' + JSON.stringify(data.data));
        //this.tableData=data.data.data.rows  //根据后端响应数据格式修改
        //console.log("获取的客户经理信息：",this.tableData)
        //this.total=data.data.data.total ||0
      }).catch(error => {
          console.error('请求失败:', error);
          alert('请求失败: ' + error.message);
        });
    },

    //-----------以上为测试需要-------------
    //-----主页面------
    //退出登陆
    handleCommand(command) {
      if (command === 'logout') {
        this.$router.push('/login');
      }
    },
    handleSizeChange(pageSize) {
      this.pageData.pageSize = pageSize;  // 更新页面大小
      this.fetchTableData();              // 重新获取数据
    },
    // 主页面分页切换
    handleMainPageChange(val) {
      this.pageData.page = val;  // 更新当前页码
      this.fetchTableData();     // 重新获取数据
    },
    handleMenu() {
      // 此处可实现侧边栏折叠逻辑
    },
    // 页面加载或数据初次获取时调用----在created中调用，加载页面时初步获取
    fetchTableData() {
      getManagerList({
        params: {
          page: this.pageData.page,  // 确保分页参数正确传递
          pageSize: this.pageData.pageSize,
          jobNumber: this.administratorID
        }
      }).then((data) => {
        this.originalTableData = data.data.data.rows || [];
        this.tableData = this.originalTableData.map(item => ({
          jobNumber: item.jobNumber,
          managerName: item.managerName,
          salesVolume: item.salesVolume,
          salesGrowth: item.salesGrowth,
          newCustomersNum: item.newCustomersNum,
          churnRate: item.churnRate,
          satisfaction: item.satisfaction,
        }));
        this.total = data.data.data.total || 0;
      });
    },

     // 根据搜索框的内容进行过滤
    filterTableData() {
      if (this.searchText) {
        // 根据搜索框的关键字过滤数据
        this.tableData = this.originalTableData
          .filter(item => item.managerName.includes(this.searchText))
          .map(item => ({
            jobNumber: item.jobNumber,
            managerName: item.managerName,
            salesVolume: item.salesVolume,
            salesGrowth: item.salesGrowth,
            newCustomersNum: item.newCustomersNum,
            churnRate: item.churnRate,
            satisfaction: item.satisfaction,
          }));
      } else {
        // 当搜索框为空时，恢复所有数据
        this.tableData = this.originalTableData.map(item => ({
          jobNumber: item.jobNumber,
          managerName: item.managerName,
          salesVolume: item.salesVolume,
          salesGrowth: item.salesGrowth,
          newCustomersNum: item.newCustomersNum,
          churnRate: item.churnRate,
          satisfaction: item.satisfaction,
        }));
      }
    },

    //导出所有客户经理营销的信息
    handleExport() {
      // 获取所有数据，将 pageSize 设置为一个足够大的值以确保获取到所有数据
      getManagerList({ params: { pageSize: 10000, jobNumber: this.administratorID } }).then((data) => {
        const filteredData = data.data.data.rows.map(item => ({
          jobNumber: item.jobNumber,
          managerName: item.managerName,
          salesVolume: item.salesVolume,
          salesGrowth: item.salesGrowth,
          newCustomersNum: item.newCustomersNum,
          churnRate: item.churnRate,
          satisfaction: item.satisfaction,
        }));
        
        const managerFieldMapping = {
          jobNumber: "工号",
          managerName: "姓名",
          salesVolume: "销售额",
          salesGrowth: "销售增长率",
          newCustomersNum: "新客户数",
          churnRate: "流失率",
          satisfaction: "满意度"
        };
        let fileName = "部门客户经理营销信息";
        this.exportData(filteredData, managerFieldMapping, fileName);
      });
    },


    //-----------dialog页面------------------
    //点击查看获得当前查看按钮行的客户经理详情营销信息
    // 查看客户经理的详细营销交易信息
    handleCheck(row) {
      this.transFileName = row.managerName;
      this.dialogTitle = `${row.managerName} 的营销详情`;
      this.transactionForm.customerManagerID = row.jobNumber; // 保存当前客户经理ID

      // 重置 transactionData
      this.transactionData = [];
      this.dialogTableVisible = true; // 确保 dialog 被打开

      getTransList({
        params: {
          jobNumber: row.jobNumber,
        }
      }).then((data) => {
        this.transactionData = data.data.data.rows;
        this.dialogTotal = data.data.data.total || 0;
      }).catch((error) => {
        console.error('请求失败:', error);
        this.dialogTableVisible = false; // 请求失败时关闭 dialog
      });
    },

    //导出当前客户经理的全部营销交易信息---可以根据时间段选择性导出，没有日期则不传递参数
    //确保后端能够处理缺失日期参数的情况，并返回相应的数据
    handleTransExport() {
      const [startDate, endDate] = this.dateRange;
      let dateParams = {};

      if (startDate && endDate) {
        dateParams = {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        };
      }
      getTransList({
        params: {
          pageSize: 10000,
          jobNumber: this.transactionForm.customerManagerID,
          ...dateParams
        }
      }).then((data) => {
        this.transactionData = data.data.data.rows;

        const transactionFieldMapping = {
          transactionID: "交易号",
          customerManagerID: "客户经理",
          customerName: "客户姓名",
          transactionDate: "交易日期",
          productName: "产品类型",
          transactionAmount: "交易金额",
          marketingProgress: "营销进度",
          customerRating: "客户评分",
          createdDate: "创建时间",
          updatedDate: "更新时间"
        };

        // 动态生成文件名
        let fileName = `${this.transFileName}详情营销信息`;
        if (startDate && endDate) {
          fileName += `_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
        }

        // 导出数据时传入动态生成的文件名
        this.exportData(this.transactionData, transactionFieldMapping, fileName);
      });
    },

    //导出数据的方法函数
    exportData(data, fieldMapping, fileName) {
      // 创建一个新的数组，用于存放转换后的数据
      const mappedData = data.map(item => {
        const mappedItem = {};
        // 遍历每个对象，将其键转换为中文字段名
        for (const key in item) {
         if (fieldMapping[key]) {
          mappedItem[fieldMapping[key]] = item[key];
          }
        }
        return mappedItem;
      });
      // 将转换后的数据生成工作表
      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      // 创建一个新的工作簿
      const workbook = XLSX.utils.book_new();
      // 将工作表添加到工作簿中
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Export");
      // 将工作簿转换为二进制数据
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // 触发文件下载
      FileSaver.saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${fileName}.xlsx`);
    }
  },
  watch: {
    // 监听 searchText 的变化
    searchText() {
      this.filterTableData();
    }
  },
  created() {
    // 页面加载时获取并保存数据
    this.fetchTableData();
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

  .left-section {
  display: flex; /* 左侧内容使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
  gap: 10px; /* 搜索框与按钮之间的间距 */

  .right-section {
  display: flex; /* 右侧内容也使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
}
}
}
.common-table {
  position: relative;
}

.pager {
  text-align: center;
  margin-top: 20px;
}
.dialogHeader{
  display: flex;
}

.dialogBotton{
  text-align: center;
  margin-top: 20px;
}

.el-header {
  padding: 0;
}

</style>
    