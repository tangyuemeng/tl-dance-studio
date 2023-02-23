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
  app.globalData.islogin = true
  app.globalData.userID = result.data[0].userID
  app.globalData.vip = result.data[0].vip
  app.globalData.cardtype = result.data[0].cardtype ? result.data[0].cardtype : "未登录"
  app.globalData.num = result.data[0].num
  app.globalData.nickName = result.data[0].nickName
  app.globalData.name = result.data[0].name
  app.globalData.phonenum = result.data[0].phonenum
  app.globalData.email = result.data[0].email
  app.globalData.point = result.data[0].point ? result.data[0].point : 0
   var userID = app.globalData.userID
   var num = app.globalData.num
   var cardtype = app.globalData.cardtype
   var nickName = app.globalData.nickName ? app.globalData.nickName : "新规用户"
   var point = app.globalData.point
   var name = app.globalData.name
   var phonenum = app.globalData.phonenum
   var email = app.globalData.email
   var school = app.globalData.school
   this.setData({
    userID : userID,
    num : num,
    cardtype : cardtype,
    nickName : nickName,
    point : point,
    email: email,
    phonenum:phonenum,
    name:name,
    school:school
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