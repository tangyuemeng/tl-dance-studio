// pages/danceEvent/event.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        let result = await db.collection("danceEvent").get()
        this.setData({
            list: result.data
        })
    },

    navi_home() {
        wx.navigateBack({
        delta: 1,
        });
  },

    navi_number(e) {
        app.globalData.numberTitle = e.currentTarget.dataset.title
        app.globalData.numberInfo = e.currentTarget.dataset.info
        wx.navigateTo({
          url: './number',
        })
    },
})