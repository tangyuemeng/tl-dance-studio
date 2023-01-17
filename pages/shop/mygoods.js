// miniprogram/pages/shop/mygoods.js
var util = require('../../utils/util.js');
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    loadProgress:0,
    loadflag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () {
    this.loadProgress()
    let result = await db.collection('shop').get()
    let list = result.data
    this.setData({
      list:list
    })
    this.data.loadflag = true
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadProgress(){
    this.setData({
      loadProgress: this.data.loadProgress+3
    })
    if (!this.data.loadflag){
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    }else{
      this.setData({
        loadProgress: 0
      })
    }
  },
})