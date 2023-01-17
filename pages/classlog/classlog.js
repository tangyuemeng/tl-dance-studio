// miniprogram/pages/classlog/classlog.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadProgress:0,
    loadflag:false,
    class_count:0,
    warning_flag:"",
    i:0,
    flag:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () { 
    var time = new Date()     // 获取当前时间日期
    var month = time.getMonth() + 1   // 获取月份
    var month_str = String(month)
    console.log(month_str.length)
    this.setData({
      loadModal: true
    })
    console.log(app.globalData.userID)
    let count = await db.collection('class-copy').where({userID:app.globalData.userID}).count()
    count = count.total
    var classlog = new Array()
    for (let k = 0; k<count; k += 20 ){
      let classlog_list = await db.collection('class-copy').where({userID:app.globalData.userID}).skip(k).get()
     // console.log(messageboard_list.data)
      for (let c in classlog_list.data){
        classlog.push(classlog_list.data[c])
      }
    }
    classlog.reverse()
    for (var i in classlog){
      let date = classlog[i].date
      if (month_str.length == 1){
        if (date.slice(0,1) == month_str){
          this.data.class_count += 1 
          this.showflag(this.data.class_count)
        }
      }
      else{
        if (date.slice(0,2) == month_str){
          this.data.class_count += 1 
          this.showflag(this.data.class_count)
        }
      }
    }
    this.numDH(this.data.class_count)
    this.setData({
      classlog:classlog,
    })
    this.setData({
      loadModal: false
    })
  },
   numDH(e) {
    var that = this
    if (this.data.i < 20) {
      setTimeout(function () {
        that.setData({
          class_count: that.data.i,
        })
        that.data.i += 1 
        that.numDH(e);
      }, 70)
    } else {
      that.setData({
        class_count: e,
      })
    }
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
  showflag(e){
    var flag = e > 2 ? '进步来源于不断的努力' : '别让懒惰阻止你前进的脚步'
    flag = e > 7 ? '表现不错,继续加油!' : '进步来源于不断的努力'
    this.setData({
      warning_flag:flag
    })
   
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
  loadProgress(){
    this.setData({
      loadProgress: this.data.loadProgress+3
    })
    if (!this.data.loadflag){
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    }else{
      this.setData({
        loadProgress: 0
      })
    }
  },
})