// pages/danceEvent/number.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            title: app.globalData.numberTitle,
            info: app.globalData.numberInfo
        })
    },

    nameInput: function (e) {
        this.setData({
          name: e.detail.value,
        });
      },

    navi_home() {
        wx.navigateBack({
        delta: 1,
        });
  },

  submit(){
    if (this.data.name == ""){
        wx.showToast({
          title: '请输入必要信息',
          icon: "error",
        })
        return
    }
    db.collection("eventForm").add({
        data: {
          number: app.globalData.numberTitle,
          userID: app.globalData.userID,
          name: this.data.name,
        },
      });
      wx.showToast({
        title: "报名成功",
      });
  }
})