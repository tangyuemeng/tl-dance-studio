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
        console.log(result.data)
    },

    navi_home() {
        wx.navigateBack({
        delta: 1,
        });
  },

    navi_number() {
        wx.navigateTo({
          url: './number',
        })
    },
})