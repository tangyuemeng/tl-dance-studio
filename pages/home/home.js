// miniprogram/pages/home.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({
  options: {
    addGlobalClass: true,
    Custom: app.globalData.Custom
  },
  data: {
  },

  onLoad: function (options) {
    this.randomClass()
    this.setData({
        userID : app.globalData.userID,
        school : app.globalData.school
    })
  },

  async randomClass(){
    let response = await db.collection('classlist').get()
    let result = response.data
    let i = Math.floor(Math.random() * 10);
    var popupclass = result[i]
    console.log(popupclass)
    this.setData({
        popupclass:popupclass
    })
  },

  navi_setting(){
      wx.redirectTo({
        url: '/pages/userinfo/userinfo',
      })
  },

  navi_class(){
    if (app.globalData.vip){
        wx.navigateTo({
            url: '/pages/appointment/appointment',
        })
    }
  },

  navi_shop(){
    wx.navigateTo({
        url: '/pages/shop/shop',
      })
  },

  navi_book(){
    wx.navigateTo({
        url: '/pages/myappointment/myappointment',
      })
  },

})