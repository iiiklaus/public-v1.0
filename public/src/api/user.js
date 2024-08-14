import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      transactionID: Mock.Random.integer(100,200,3),
      customerName: Mock.Random.cname(),
      transactionDate: Mock.Random.date(),
      productName: Mock.Random.word(),
      transactionAmount: Mock.Random.float(100, 10000, 2, 2),
      marketingProgress: Mock.Random.word(),
      customerRating: Mock.Random.integer(1, 5),
      createdDate: Mock.Random.date(),
      updatedDate: Mock.Random.date(),
    })
  );
}

export default {
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserList: config => {
    const { name, page = 1, limit = 20 } = param2Obj(config.url)
    // console.log('name:' + name, 'page:' + page, '分页大小limit:' + limit)
    const mockList = List.filter(user => {
      if (name && user.name.indexOf(name) === -1 && user.addr.indexOf(name) === -1) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 20000,
      count: mockList.length,
      list: pageList
    }
  },
  /**
   * 增加用户
   * @param name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
  createUser: config => {
    const { customerName, transactionDate, productName, transactionAmount, marketingProgress, customerRating, createdDate, updatedDate } = JSON.parse(config.body);
    List.unshift({
      transactionID: Mock.Random.guid(),
      customerName,
      transactionDate,
      productName,
      transactionAmount,
      marketingProgress,
      customerRating,
      createdDate,
      updatedDate
    });
    return {
      code: 20000,
      data: {
        message: '添加成功'
      }
    };
  },
  /**
   * 删除用户
   * @param id
   * @return {*}
   */
  deleteUser: config => {
    const { transactionID } = JSON.parse(config.body);
    const index = List.findIndex(item => item.transactionID === transactionID);
    if (index !== -1) {
      List.splice(index, 1);
    }
    return {
      code: 20000,
      data: 'success'
    };
  },
  /**
   * 批量删除
   * @param config
   * @return {{code: number, data: {message: string}}}
   */
  batchremove: config => {
    let { ids } = param2Obj(config.url)
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    return {
      code: 20000,
      data: {
        message: '批量删除成功'
      }
    }
  },
  /**
   * 修改用户
   * @param id, name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
  updateUser: config => {
    const { transactionID, customerName, transactionDate, productName, transactionAmount, marketingProgress, customerRating, createdDate, updatedDate } = JSON.parse(config.body);
    const index = List.findIndex(item => item.transactionID === transactionID);
    if (index !== -1) {
      List[index] = {
        transactionID,
        customerName,
        transactionDate,
        productName,
        transactionAmount,
        marketingProgress,
        customerRating,
        createdDate,
        updatedDate
      };
    }
    return {
      code: 20000,
      data: 'success'
    };
  },
  getTransactionById: config => {
  const { transactionID } = JSON.parse(config.body);
  for (const transaction of List) {
    if (transaction.transactionID === transactionID) 
      {
      return {
        code: 20000,
        data: transaction
      };
    }
  }
  return {
    code: 40004,
    message: 'Transaction not found'
  };
}
};