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
    ischangeview:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */


async onLoad () {
  let result = await db.collection('User').get()
  app.globalData.islogin = true
  app.globalData.userID = result.data[0].userID
  app.globalData.vip = result.data[0].vip
  app.globalData.cardtype = result.data[0].cardtype ? result.data[0].cardtype : "新规套餐"
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
   this.setData({
    userID : userID,
    num : num,
    cardtype : cardtype,
    nickName : nickName,
    point : point,
    email: email,
    phonenum:phonenum,
    name:name
   })
   console.log(num)
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
  nameinput(e){
    this.setData({
      name: e.detail.value
    })
  },  
   emailinput(e){
    this.setData({
      email: e.detail.value
    })
   },
  phoneinput(e){
    this.setData({
      phonenum: e.detail.value
    })
  },
  nicknameinput(e){
    this.setData({
      nickname: e.detail.value
    })
  },

  saveinfo(){
    db.collection('User').where({userID:app.globalData.userID}).update({ 
      data : {
      "name": this.data.name,
      "email" : this.data.email,
      "phonenum":this.data.phonenum,
      "nickName":this.data.nickname,
    }
  })
  this.setData({
    hasinfo:true
  })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  changeview(){
    this.setData({
      ischangeview:true
    })
  },
  updateinfo(){
    if (this.data.name  === null || this.data.nickname  === null || this.data.phonenum  === null || this.data.email === null ){
      wx.showToast({
        title: '信息不能为空',
        icon:"error"
    })
    return
    }
    this.saveinfo()
    this.setData({
      ischangeview:false
    })
    wx.showToast({
      title: '保存成功',
      icon : 'check'
  })
    setTimeout(()=> {
      wx.navigateBack({
        delta: -1,
      })
    },1000)
  },
  async checkin(){
    var that = this
    var toggle 
    this.setData({
      toggle:true
    })
    setTimeout(function() {
      that.setData({
        toggle: false
      })
    }, 1000)
    var time = new Date()
    var date = new Date(time.setDate(time.getDate() + 0)).getDate()
    var month = time.getMonth() + 1
    date = month + '-' + date
    var hour = time.getHours()
    console.log(hour)
    var count = await db.collection('class').where({date:date,userID:app.globalData.userID,checkin:false}).count()
    var result = await db.collection('class').where({date:date,userID:app.globalData.userID,checkin:false}).get()
    let point = 10*count.total
    console.log(point)
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
})