// miniprogram/pages/home.js
const app = getApp()
Page({
  options: {
    addGlobalClass: true,
    Custom: app.globalData.Custom
  },
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = new Date() 
    var date = time.getDate()  
    var year = time.getFullYear()
    var month = time.getMonth()+1
    let deadday = String(year) + '年' + String(month+1) + '月' + String(date) + '日'
    app.globalData.deadday = deadday
    this.setData({
        school : app.globalData.school
    })
 

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
})