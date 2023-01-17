// miniprogram/pages/home.js
const app = getApp()
Page({
  options: {
    addGlobalClass: true,
    Custom: app.globalData.Custom
  },
  data: {
    elements: [{
      title: '在线约课',
      name: 'appointment',
      color: 'appointment',
      icon: 'tagfill'
    },
    {
      title: '我的预约',
      name: 'class',
      color: 'myappointment',
      icon: 'newsfill'
    },
    {
      title: '上课记录',
      name: 'log',
      color: 'classlog',
      icon: 'copy'
    },
    {
      title: '留言板 ',
      name: 'message',
      color: 'messageboard',
      icon: 'comment'
    },
    {
      title: '个人中心',
      name: 'profile',
      color: 'userinfo',
      icon: 'profile'
    },
    {
      title: '积分商场',
      name: 'shop',
      color: 'shop',
      icon: 'shop',
    },
    {
      title: '在线客服',
      name: 'service',
      color: 'brown',
      icon: 'service',
      service:true
    }
  

  ]},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = new Date() 
    var date = time.getDate()  
    var year = time.getFullYear()
    var month = time.getMonth()+1
    let deadday = String(year) + '年' + String(month+1) + '月' + String(date) + '日'
    console.log(deadday)
    app.globalData.deadday = deadday
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
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  toggle(e){
    var that = this
    var toggle 
    this.setData({
      toggle: e.currentTarget.dataset.id
    })
    setTimeout(function() {
      that.setData({
        toggle: ''
      })
    }, 1000)
  }
})