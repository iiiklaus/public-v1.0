// import axios from 'axios';

// // 基础URL配置
// const BASE_URL = '/'; // 将此处替换为你的实际API URL

// // 获取交易信息（分页）
// export function getTransactionPage(params) {
//   return axios.get(`${BASE_URL}/transaction/page`, { params });
// }

// // 删除交易信息
// export function deleteTransaction(ids) {
//   return axios.delete(`${BASE_URL}/transaction/${ids}`);
// }

// // 添加交易信息
// export function createTransaction(data) {
//   return axios.post(`${BASE_URL}/transaction`, data);
// }

// // 根据ID获取交易信息
// export function getTransactionById(id) {
//   return axios.get(`${BASE_URL}/transaction/${id}`);
// }

// // 更新交易信息
// export function updateTransaction(data) {
//   return axios.put(`${BASE_URL}/transaction`, data);
// }


import Mock from 'mockjs';

let List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    transactionID: Mock.Random.guid(),
    customerName: Mock.Random.cname(),
    transactionDate: Mock.Random.date('yyyy-MM-dd'),
    productName: Mock.Random.word(),
    transactionAmount: Mock.Random.float(1000, 10000, 2, 2),
    marketingProgress: Mock.Random.word()
  }));
}

export default {
  getReportByTime: config => {
    const { startDate, endDate } = JSON.parse(config.body);
    const filteredList = List.filter(item => {
      return item.transactionDate >= startDate && item.transactionDate <= endDate;
    });
    return {
      code: 20000,
      data: filteredList
    };
  }
};

