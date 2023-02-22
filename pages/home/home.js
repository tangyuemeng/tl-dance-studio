// miniprogram/pages/home.js
const app = getApp()
Page({
  options: {
    addGlobalClass: true,
    Custom: app.globalData.Custom
  },
  data: {
  },
  onLoad: function (options) {
    var time = new Date() 
    var date = time.getDate()  
    var year = time.getFullYear()
    var month = time.getMonth()+1
    let deadday = String(year) + '年' + String(month+1) + '月' + String(date) + '日'
    app.globalData.deadday = deadday
    this.setData({
        userID : app.globalData.userID,
        school : app.globalData.school
    })
  },
  navi_setting(){
      wx.redirectTo({
        url: '/pages/userinfo/userinfo',
      })
  },
  navi_class(){
    wx.navigateTo({
        url: '/pages/appointment/appointment',
      })

  },
  navi_shop(){
    wx.navigateTo({
        url: '/pages/shop/shop',
      })
  }

})