const { scheduleJob, RecurrenceRule } = require('node-schedule');
const { QAK } = require('./db');
const { getStockHistoryData, getOneDayRealStockData } = require('./service');

// 写入数据
const insertData = async (data = [], dm, mc, jys) => {
  try {
    const insertList = data.map(({ t, o, h, l, p, v }) => {
      const obj = {
        id: dm,
        close: p,
        open: o,
        high: h,
        low: l,
        quantity: v,
        ds: t.split(' ')[0].replace(/-/g, ''),
      }
      return obj;
    })
    console.log('写入数据', dm, mc);
    await QAK.bulkCreate(insertList);
    console.log('写入完成', dm, mc);
  } catch (error) {
    console.log('写入失败', error.msg);
  }

};

// 获取最新一天数据
const insertOneDayData = (stockList) => {
  let errList = [];
  let listIndex = 0;
  let status = 'ok';
  const runRule = new RecurrenceRule();
  runRule.second = Array.from({ length: 30 }, (v, i) => i * 2);
  const schedule = scheduleJob(runRule, async () => {
    if (status === 'pendding') {
      console.log('等待返回中～～');
      status = 'ok';
      return;
    }
    // 全部请求完成
    if (listIndex >= stockList.length) {
      console.log('出错的', errList.join(','));
      console.log('已完成～～');
      schedule.cancel();
      return;
    }
    const { dm, mc, jys } = stockList[listIndex]
    console.log('获取数据', listIndex, dm, mc, jys);
    try {
      const data = await getOneDayRealStockData(dm);
      console.log(data);
      if (data && data.t) {
        await insertData([data], dm, mc, jys);
        listIndex = listIndex + 1;
        status = 'ok';
      }
      if (typeof data === 'string') {
        console.log('等待3s后重试', data, data.includes('404无资源'));
        status = 'pendding';
        if (data.includes('404无资源')) {
          console.log('抬走，下一个~');
          status = 'ok';
          listIndex = listIndex + 1;
        }
      }
    } catch (error) {
      console.log('ddd', error.msg);
      listIndex = listIndex + 1;
      errList.push(dm);
      console.log('跳过数据', dm, mc, jys);
    }
  })
};

// 建立数据库时补充历史数据
const insertHistoryData = (stockList) => {
  let errList = [];
  let listIndex = 0;
  let status = 'ok';
  const runRule = new RecurrenceRule();
  runRule.second = Array.from({ length: 20 }, (v, i) => i * 3);
  const schedule = scheduleJob(runRule, async () => {
    if (status === 'pendding') {
      console.log('等待返回中～～');
      status = 'ok';
      return;
    }
    // 全部请求完成
    if (listIndex >= stockList.length) {
      schedule.cancel();
      console.log('出错的', errList.join(','));
      console.log('已完成～～');
      return;
    }
    const { dm, mc, jys } = stockList[listIndex]
    console.log('获取数据', listIndex, dm, mc, jys);
    try {
      const data = await getStockHistoryData(dm);
      if (data && Array.isArray(data) && data.length) {
        await insertData(data, dm, mc, jys);
        listIndex = listIndex + 1;
        status = 'ok';
      }
      if (typeof data === 'string') {
        console.log('等待3s后重试', data, data.includes('404无资源'));
        status = 'pendding';
        if (data.includes('404无资源')) {
          console.log('抬走，下一个~');
          status = 'ok';
          listIndex = listIndex + 1;
        }
      }
    } catch (error) {
      console.log('ddd', error);
      listIndex = listIndex + 1;
      errList.push(dm);
      console.log('跳过数据', dm, mc, jys);
    }

  })
}

module.exports = { insertOneDayData, insertHistoryData };
