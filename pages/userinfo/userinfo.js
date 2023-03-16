// miniprogram/pages/userinfo/userinfo.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:null,
    email:null,
    phonenum:null,
    nickname:null,
    list : [
        {"en":"Logging","ch":"上课记录","navi":"log"},
        {"en":"Coupon","ch":"我的卡包","navi":"card"},
        {"en":"Service","ch":"在线客服","btn":"btn"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */


async onLoad () {
  let result = await db.collection('User').get()
  if (result.data.length === 0){
    app.globalData.islogin = false
    app.globalData.userID = "********"
    app.globalData.vip = false
    app.globalData.cardtype = "****"
    app.globalData.num = 0
    app.globalData.point = 0
  }
  else{
    app.globalData.userID = result.data[0].userID
    app.globalData.vip = result.data[0].vip
    app.globalData.cardtype = result.data[0].cardtype ? result.data[0].cardtype : "未登录"
    app.globalData.num = result.data[0].cardtype === "受け放題" ? "无限" : result.data[0].num
    app.globalData.point = result.data[0].point ? result.data[0].point : 0
    app.globalData.campus = result.data[0].campus 
  }
   var vip = app.globalData.vip
   var userID = app.globalData.userID
   var num = app.globalData.num
   var cardtype = app.globalData.cardtype
   var point = app.globalData.point
   var campus = app.globalData.campus
   this.setData({
    vip : vip,
    userID : userID,
    num : num,
    cardtype : cardtype,
    point : point,
    campus: this.selectCampus()
   })
  },

  async checkin(){
    var time = new Date()
    var date = new Date(time.setDate(time.getDate() + 0)).getDate()
    var month = time.getMonth() + 1
    date = month + '-' + date
    var hour = time.getHours()
    console.log(hour)
    var count = await db.collection('class').where({date:date,userID:app.globalData.userID,checkin:false}).count()
    var result = await db.collection('class').where({date:date,userID:app.globalData.userID,checkin:false}).get()
    let point = 10*count.total
      if (result.data.length == 0 ){
        wx.showToast({
               title: '签到失败',
                icon : 'error',
             })
      }
      else {
        db.collection('class-copy').where({
          date:date
        }).update({
          data: {
            checkin: true
          }})
        db.collection('class').where({
              date:date
            }).update({
              data: {
                checkin: true
              },
              success: function(res) {
                wx.showToast({
                  title: '签到成功',
                  duration:1000,
                })
              }
            })
            db.collection('User').where({
            }).update({
              data: {
                point: _.inc(Number(point))
              },
              
            })
    }
},
    selectCampus(){
        switch(app.globalData.campus){
            case "ookubo":
                return "大久保店"
                break
            case "ikebukuro":
                return "池袋店"  
                break    
            case "shinkoiwako":
                return "新小岩店"    
                break
            default:
                return "error"
        }
    },

    navi_home(){
        wx.redirectTo({
            url: '/pages/home/home',
        })
    },

    navi_log(){
        wx.navigateTo({
            url: '/pages/classlog/classlog',
        })
    },

    navi_card(){
        wx.navigateTo({
            url: '/pages/shop/mygoods',
        })
    },
})