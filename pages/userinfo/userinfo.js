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
        // not ookubo user
      let result = await db.collection('User-TLK').get()
      if (result.data.length === 0){
        app.globalData.islogin = false
        app.globalData.userID = "********"
        app.globalData.vip = false
        app.globalData.cardtype = "****"
        app.globalData.num = 0
        app.globalData.point = 0
      }
      else{
        app.globalData.islogin = true
        app.globalData.userID = result.data[0].userID
        app.globalData.vip = result.data[0].vip
        app.globalData.cardtype = result.data[0].cardtype ? result.data[0].cardtype : "新规套餐"
        app.globalData.num = result.data[0].num
        app.globalData.allowedNum = result.data[0].allowedNum
        app.globalData.campus = result.data[0].campus 
        app.globalData.level = result.data[0].level
      }
    }
    else{
    app.globalData.islogin = true
    app.globalData.userID = result.data[0].userID
    app.globalData.vip = result.data[0].vip
    app.globalData.cardtype = result.data[0].cardtype ? result.data[0].cardtype : "新规套餐"
    app.globalData.num = result.data[0].num
    app.globalData.point = result.data[0].point ? result.data[0].point : 0
    app.globalData.campus = result.data[0].campus 
    app.globalData.level = result.data[0].level
    }
   var vip = app.globalData.vip
   var userID = app.globalData.userID
   var num = app.globalData.num
   var allowedNum = app.globalData.allowedNum
   var cardtype = app.globalData.cardtype
   var point = app.globalData.point
   var campus = app.globalData.campus
   this.setData({
    vip : vip,
    userID : userID,
    num : num,
    cardtype : cardtype,
    allowedNum:allowedNum,
    point : point,
    campus: campus
   })
  },

  async checkin(){
    var time = new Date()
    var date = new Date(time.setDate(time.getDate() + 0)).getDate()
    var month = time.getMonth() + 1
    var day = time.getDay()
    date = month + '-' + date
    var hour = time.getHours()
    var count = await db.collection('class').where({date:date,userID:app.globalData.userID,checkin:false}).count()
    var result = await db.collection('class').where({date:date,userID:app.globalData.userID,checkin:false}).get()
    let record = await db.collection('record').where({date:date,userID:app.globalData.userID,campus : app.globalData.campus}).get()
    let point = 10*count.total
    if( app.globalData.campus == "大久保店"){
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
    }
    if(app.globalData.campus == "池袋店" || app.globalData.campus == "新小岩店"){   
        if (app.globalData.vip){
            if (record.data.length == 0){
                db.collection('record').add({
                    data: {
                        userID : app.globalData.userID,
                        xqj : day,
                        date : date,
                        campus : app.globalData.campus
                    }
                })
                wx.showToast({
                    title: '签到成功',
                    duration:1000,
                })
            }
            else{
                wx.showToast({
                    icon:'error',
                    title: '已签到',
                })
            }
        }
        else{
            wx.showToast({
                title: '会员卡已过期',
                icon:"error"
            })    
        }
    }
},


    openBalance(){
        if (app.globalData.level == 1){
            wx.navigateTo({
                url: '/pages/balance/balance',
            })
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
        if(app.globalData.campus == "大久保店"){
            wx.navigateTo({
                url: '/pages/shop/mygoods',
            })
        }else{
            wx.showToast({
                title: '校区选择错误',
                icon:"error"
            }) 
        }
    },
})