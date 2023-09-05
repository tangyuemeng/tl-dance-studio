// miniprogram/pages/classlog/classlog.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    class_count: 0,
    i: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    var time = new Date(); // 获取当前时间日期
    var month = time.getMonth() + 1; // 获取月份
    var month_str = String(month);
    let count = await db
      .collection("class-copy")
      .where({ userID: app.globalData.userID })
      .count();
    count = count.total;
    var classlog = new Array();
    for (let k = 0; k < count; k += 20) {
      let classlog_list = await db
        .collection("class-copy")
        .where({ userID: app.globalData.userID })
        .skip(k)
        .get();
      // console.log(messageboard_list.data)
      for (let c in classlog_list.data) {
        classlog.push(classlog_list.data[c]);
      }
    }
    classlog.reverse();
    for (var i in classlog) {
      let date = classlog[i].date;
      if (month_str.length == 1) {
        if (date.slice(0, 1) == month_str) {
          this.data.class_count += 1;
        }
      } else {
        if (date.slice(0, 2) == month_str) {
          this.data.class_count += 1;
        }
      }
    }
    this.numDH(this.data.class_count);
    this.setData({
      classlog: classlog,
    });
  },

  numDH(e) {
    var that = this;
    if (this.data.i < 20) {
      setTimeout(function () {
        that.setData({
          class_count: that.data.i,
        });
        that.data.i += 1;
        that.numDH(e);
      }, 70);
    } else {
      that.setData({
        class_count: e,
      });
    }
  },

  navi_home() {
    wx.navigateBack({
      delta: 1,
    });
  },
});
