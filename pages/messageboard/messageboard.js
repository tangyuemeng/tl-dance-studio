// miniprogram/pages/Messageboard/messageboard.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : null,
    isliked : false,
    userID : null,
    CustomBar: app.globalData.CustomBar,
    loadProgress:0,
    loadflag:false
  },
  compare:function (property) {

    return function (a, b) {
    
    var value1 = a[property];
    
    var value2 = b[property];
    
    return value2 - value1;
    
    }
    
    },

 
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () {
    this.loadProgress()
    let count = await db.collection('Messeageboard').count()
    count = count.total
 //   console.log(count)
  //  let userID = await db.collection('User').get()
    this.data.userID = app.globalData.userID
//    console.log(this.data.userID)
    let messageboard = []
      for (let k = 0; k<count; k += 20 ){
        let messageboard_list = await db.collection('Messeageboard').skip(k).get()
        console.log(messageboard_list.data)
        for (let c in messageboard_list.data){
          messageboard.push(messageboard_list.data[c])
        }
      }
        messageboard.sort(this.compare("likenum"))
        for (let j in messageboard){
          if (messageboard[j].likelist.length != 0){
        for (let i in messageboard[j].likelist){                                                        
          console.log(this.data.userID)
          if (messageboard[j].likelist[i] === this.data.userID){
            messageboard[j].isliked = true
          }
        } 
      }
      }
    this.setData({
      messageboard:messageboard
    })
    this.data.loadflag = true
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
  ,
  contentinput(e){
    this.setData({
      content: e.detail.value
    })
  },
  appreciate : function (e){
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
    db.collection('User').get().then(res => {
    db.collection('Messeageboard')
    .where({
      title: e.currentTarget.dataset.title,
      content : e.currentTarget.dataset.content
    })
    .update({
      data:{
        likenum : _.inc(1),
        likelist : _.push(res.data[0].userID)
      },

    })
  })

  wx.showToast({
    title: '点赞成功',
    icon : 'check'
})
setTimeout(()=> {
  wx.redirectTo({
    url: '/pages/messageboard/messageboard',
  })
},1500)

  
  },
  sendmessage (){
    if (this.data.content){
    db.collection('User').get().then(res => {
        db.collection('Messeageboard').add({
          data:{
            "title" : res.data[0].userID,
            "content" : this.data.content,
            "likenum" : 0 ,
            "isliked" : false,
            "likelist" : []
          }
        })
    })
    this.hideModal()
    wx.showToast({
      title: '已经收到您的留言',
      icon : 'check'
  })
  setTimeout(()=> {
    wx.redirectTo({
      url: '/pages/messageboard/messageboard',
    })
},1500)
    }
    else{
      wx.showToast({
        title: '留言不能为空',
        icon : 'error'
    })
    }
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