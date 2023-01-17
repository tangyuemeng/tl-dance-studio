const app = getApp()
const db = wx.cloud.database()
const _ = db.command
var util = require('../../utils/util.js');
Page({
  data: {
    array:[],
    array1:[],
  },

  onLoad: function () {
    var that = this
    db.collection('class').where({userID:app.globalData.userID}).get(
    {
      success: function(res){
        that.setData({array:res.data})
      }
    })
    var that2 = this
    db.collection('privatelesson').where({userID:app.globalData.userID}).get(
    {
      success: function(res){
        that2.setData({array1:res.data})
      }
    })
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
  SetColor(e) {
    this.setData({
      color: e.currentTarget.dataset.color,
      modalName: null
    })
  },
  SetActive(e) {
    this.setData({
      active: e.detail.value
    })
  },
  deleteclass:function(e){
    console.log(app.globalData.userID)
    var time = new Date()
    var date = new Date(time.setDate(time.getDate() + 0)).getDate()
    var month = time.getMonth() + 1
    var hour = new Date().getHours();
    date = month + '-' + date
    if (e.currentTarget.dataset.date === date)   
    {
      console.log(date)
      if (e.currentTarget.dataset.timestamp <= hour){
      wx.showToast({
        title: '已超过可取消时间',
        icon : 'error'
        })
        return
       }
      }
  
   wx.showModal({
    content: '确定取消吗？',
    confirmText: "确定",
    cancelText: "取消",
    success:function(res){
    if (res.confirm){   
      console.log(e.currentTarget.dataset.classid)
         db.collection('class').where({classid:e.currentTarget.dataset.id,userID:app.globalData.userID}).remove({
      })
      db.collection('class-copy').where({classid:e.currentTarget.dataset.id,userID:app.globalData.userID}).remove({
      })
      if (app.globalData.cardtype != "受け放題"){
      db.collection('User').where({
      }).update({
        data: {
          num: _.inc(1)
        },
      })
      }
        wx.navigateBack({
             delta: 1,
        })
    }
  }
})
    
    
    
  },
  downinfo:function(e){
  
  }


  })

