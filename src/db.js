const Sequelize = require('sequelize');
const DB = new Sequelize('mystock', 'root', '123456', {
  dialect: 'mysql',    //数据库类型
  host: '127.0.0.1',   //主机地址
  port: "3306",
  pool: {      //连接池设置
    max: 10,  //最大连接数
    idle: 30000,
    acquire: 60000
  },
  dialectOptions: {
    charset: 'utf8mb4',  //字符集
    collate: 'utf8mb4_unicode_ci'
  },
  define: {   //模型设置
    freezeTableName: true,    //自定义表面，不设置会自动将表名转为复数形式
    timestamps: false    //自动生成更新时间、创建时间字段：updatedAt,createdAt
  },
  logging: false
})

const QAK = DB.define('quantity_and_kline', {
  id: {
    type: Sequelize.STRING(45),
    primaryKey: true
  },
  ds: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  close: {
    type: Sequelize.FLOAT,
  },
  open: {
    type: Sequelize.FLOAT,
  },
  high: {
    type: Sequelize.FLOAT,
  },
  low: {
    type: Sequelize.FLOAT,
  },
  quantity: {
    type: Sequelize.INTEGER,
  },
})

module.exports = { DB, QAK };
