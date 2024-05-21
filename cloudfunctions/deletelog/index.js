// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const _ = db.command;

// 获取当前日期的格式化函数
function getFormattedDate() {
    var time = new Date(); // 获取当前时间日期
    var month = time.getMonth() + 1; // 获取月份
    var date = time.getDate(); // 获取日期
    var formattedDate = month + "-" + date; // 格式化为"月份-日期"字符串
    return formattedDate;
}

// 云函数入口函数
exports.main = async (event, context) => {
    var today = getFormattedDate()
    try {
      return await db.collection('class').where({
        date: today
      }).remove()
    } catch(e) {
      console.error(e)
    }
  }