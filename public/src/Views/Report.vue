<template>
    <el-container style="height: 100vh;">
    <el-aside width="200px">
      <common-aside/>
    </el-aside>
    <el-container>
      <el-header style="background-color: #545c64; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>报表查看</el-breadcrumb-item>
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
      <el-main style="padding: 20px;">
      <el-form :inline="true" :model="form" class="form-inline">
        <el-form-item label="起始时间">
          <el-date-picker 
          v-model="form.startDate" 
          type="date" 
          placeholder="选择起始时间" 
          value-format="yyyy-MM-dd"
          :picker-options="{disabledDate:disableFutureDates}" 
          @change="checkDateRange('start')" />
        </el-form-item>
        <el-form-item label="终止时间">
          <el-date-picker 
          v-model="form.endDate" 
          type="date" 
          placeholder="选择终止时间" 
          value-format="yyyy-MM-dd" 
          :picker-options="{disabledDate:disableFutureDates}"
          @change="checkDateRange('end')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchReport">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="transactionID" label="交易ID"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名"></el-table-column>
        <el-table-column prop="transactionDate" label="交易时间"></el-table-column>
        <el-table-column prop="productName" label="产品类型"></el-table-column>
        <el-table-column prop="marketingProgress" label="交易状态"></el-table-column>
        <el-table-column prop="transactionAmount" label="交易金额"></el-table-column>
      </el-table>
      <div id="chart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
    </el-main>
    </el-container>
    </el-container>
</template>
  
  <script>
import * as echarts from 'echarts'
import CommonAside from '../components/CommonAside.vue'
import { getReportByTime, getTrans } from '../api/index';
import Cookie from 'js-cookie'
import { Message } from 'element-ui';
  
  export default {
    components:{
        CommonAside,
    },
    data() {
      return {
        form: {
          startDate: '',
          endDate: '',
          jobNumber:Cookie.get('jobNumber'),
        },
        tableData: [],
        char:null
      };
    },
    methods: {
      disableFutureDates(time) {
      return time.getTime() > Date.now();
    },
    checkDateRange(type) {
      const { startDate, endDate } = this.form;
      if (type === 'start' && startDate && endDate && startDate > endDate) {
        Message.error('起始时间不能大于终止时间，请重新选择！');
        this.form.startDate = '';
      }
      if (type === 'end' && startDate && endDate && startDate > endDate) {
        Message.error('起始时间不能大于终止时间，请重新选择！');
        this.form.endDate = '';
      }
    },
      handleCommand(command) {
        if (command === 'logout') {
          this.$router.push('/login');
        }
      },
      searchReport() {
        const params = {
        jobNumber:this.form.jobNumber,
        startDate: this.form.startDate ,
        endDate: this.form.endDate,
        };
        //const { startDate, endDate } = this.form;
        console.log("report的form:",params)
        getReportByTime(params).then((response) => {
            console.log("report的回复",response.data.data)
          this.tableData = response.data.data.rows
          this.updateChart(response.data.data.rows)
          //this.tableData=response.data.rows 根据后端修改的接口
          
        });
      },
      updateChart(data) {
        if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return;
        }
        
        //营销进度统计
        const marketingCategories   = ['意向购买', '成交', '未成交'];
        const marketingCounts  = {
            '意向购买': 0,
            '成交': 0,
            '未成交': 0
        };
        let totalAmount=0;
        //产品类型统计
        const productCategories   = ['个人贷款', '信用卡', '储蓄账户', '投资理财', '房贷'];
        const productCounts   = {
          '个人贷款': 0,
          '信用卡': 0,
          '储蓄账户': 0,
          '投资理财': 0,
          '房贷': 0
        };
        
        data.forEach(item => {
          //统计营销进度
            if (item.marketingProgress === '意向购买') {
              marketingCounts['意向购买']++;
            } else if (item.marketingProgress === '成交') {
              marketingCounts['成交']++;
              totalAmount+=item.transactionAmount;
            } else if (item.marketingProgress === '未成交') {
              marketingCounts['未成交']++;
            }
            // 统计产品类型
            if (productCategories.includes(item.productName)) {
              productCounts[item.productName]++;
            }
        });
       // 构建营销进度图表数据
      const marketingChartData = marketingCategories.map(category => ({
        name: category,
        value: marketingCounts[category]
      }));

      // 构建产品类型图表数据
      const productChartData = productCategories.map(category => ({
        name: category,
        value: productCounts[category]
      }));

      this.chart.setOption({
        title: {
          text: '营销进度统计',
          left: 'center'
        },
        tooltip:{
          trigger: 'item',
          formatter: function (params) {
            if (params.name === '成交') {
              return `${params.name}<br/>人数: ${params.value}<br/>总金额: ${totalAmount} 元`;
            }
            return `${params.name}<br/>人数: ${params.value}`;
          }
        },
        // tooltip: {
        //   trigger: 'item'
        // },
        legend: [
          {
            data: marketingCategories,
            bottom: '10%',
            left: '15%'
          },
          {
            data: productCategories,
            bottom: '10%',
            left: '60%'
          }
        ],
        series: [
          {
            name: '营销进度',
            type: 'pie',
            radius: '50%',
            center: ['25%', '35%'],
            data: marketingChartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: '产品类型',
            type: 'pie',
            radius: '50%',
            center: ['75%', '35%'],
            data: productChartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('chart'));
  }
};
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

.form-inline {
  margin-bottom: 20px;
}

.el-main {
  padding: 20px;
}
</style>