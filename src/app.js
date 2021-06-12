const Koa = require('koa');
const { getStockList } = require('./service');
const { insertOneDayData, insertHistoryData } = require('./data-controller');

const app = new Koa();
let stockList = [];

app.use(async (ctx) => {
  try {
    if (ctx.request.url === '/getHistoryData') {
      console.log('开始获取股票列表');
      stockList = await getStockList();
      console.log('获取股票列表结束');
      if (stockList.length) {
        insertHistoryData(stockList);
      }
    }
    if (ctx.request.url === '/getNewsData') {
      console.log('开始获取股票列表');
      stockList = await getStockList();
      console.log('获取股票列表结束');
      if (stockList.length) {
        insertOneDayData(stockList);
      }
    }
    ctx.body = '/getHistoryData 获取所有历史k线数据 \n/getNewsData 获取最近一个交易日的k线数据';
  } catch (error) {
    console.log(error);
  }
})

app.listen(8000);
console.log('服务启动，localhost:8000');
