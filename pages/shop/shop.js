// miniprogram/pages/shop/shop.js
var util = require('../../utils/util.js');
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      title: '9.5折',
      type: '课程优惠劵',
      text: '满5500使用',
      deadtime:'',
      price:120
  },
    {
      title: '8.5折',
      type: '课程优惠劵',
      text: '满5500使用',
      deadtime:'2022年12月31日',
      price:400
    },
    {
      title: '6.5折',
      type: '课程优惠劵',
      text: '满5500使用',
      deadtime:'2022年12月31日',
      price:900
    },
    {
      title: '30分',
      type: '舞室租用劵',
      text: '',
      deadtime:'2022年12月31日',
      price:200
    },
    {
      title: '1小时',
      type: '舞室租用劵',
      text: '',
      deadtime:'2022年12月31日',
      price:360
    }
  ]
  },


async onLoad () {
  var that = this
  for ( var i = 0 ; i < that.data.list.length ; i++) {
      that.data.list[i].deadtime = app.globalData.deadday
      that.setData({
      list : that.data.list
      })
    }
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
     that.setData({
      userID : userID,
      num : num,
      cardtype : cardtype,
      nickName : nickName,
      point : point,
      email: email,
      phonenum:phonenum,
      name:name
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
  pointtobuy(e){
    var toggle 
    this.setData({
      toggle:e.currentTarget.dataset.price
    })
    console.log(e.currentTarget.dataset.title)
    console.log(e.currentTarget.dataset.price)
    console.log(app.globalData.point)
    if (app.globalData.point >= e.currentTarget.dataset.price){
      wx.showModal({
        title:"确定兑换吗？",
        confirmText: "确定",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: '兑换成功',
            })
            db.collection('User').where({
            }).update({
              data: {
                point: _.inc(-e.currentTarget.dataset.price)
              },
            })
          db.collection('shop').add({ 
            data : {
            "userID" : app.globalData.userID,
            "type":e.currentTarget.dataset.type,
            "text":e.currentTarget.dataset.text,
            "deadtime":e.currentTarget.dataset.deadtime,
            "title":e.currentTarget.dataset.title,
            "price":e.currentTarget.dataset.price,
          }
        })
          } 
        }
      })

    }
    else{
      wx.showToast({
        title: '积分不足',
        icon : 'error',})
    }
  }
})