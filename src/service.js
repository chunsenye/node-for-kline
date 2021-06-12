const axios = require('axios');
const licence ='需要去ig507.com申请一个licence';

const getStockHistoryData = async (sid) => {
  if (!sid) {
    return [];
  }
  const historyUrl = `http://ig507.com/data/time/history/trade/${sid}/Day_qfq?licence=${licence}`;
  const { data = [] } = await axios.get(historyUrl);
  return data;
}


const getOneDayRealStockData = async (sid) => {
  if (!sid) {
    return {};
  }
  const url = `http://ig507.com/data/time/real/${sid}?licence=${licence}`;
  const { data = {} } = await axios.get(url);
  return data;
}

const getStockList = async () => {
  const listUrl = `http://ig507.com/data/base/gplist?licence=${licence}`;
  const { data = [] } = await axios.get(listUrl);
  return data;
}

module.exports = { getStockHistoryData, getStockList ,getOneDayRealStockData}; 
