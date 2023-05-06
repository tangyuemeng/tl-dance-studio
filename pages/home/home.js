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
      console.log(app.globalData.school)
    if(app.globalData.school == "大久保店"){
        if (app.globalData.vip){
            wx.navigateTo({
                url: '/pages/appointment/appointment',
            })
        }
        else{
            wx.showToast({
                title: '会员卡已过期',
                icon:"error"
            })    
        }
    }
    else{
        wx.showToast({
            title: '当前课卡不支持',
            icon:"error"
        }) 
    }

  },

  navi_shop(){
    wx.navigateTo({
        url: '/pages/shop/shop',
      })
  },

  navi_book(){
    console.log(app.globalData.campus)
    if(app.globalData.school == "大久保店"){
        wx.navigateTo({
            url: '/pages/myappointment/myappointment',
        })
        }
        else{
            wx.showToast({
                title: '当前课卡不支持',
                icon:"error"
            }) 
        }
    },
})