const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
   
  },

  async onLoad() {
    this.getNextDayOfWeek
    let response = await db.collection('class').where({userID:app.globalData.userID}).get()
    this.setData({
        array:response.data
    })
  },

  navi_home(){
    wx.navigateBack({
        delta:1
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
        db.collection('User').where({userID:app.globalData.userID}).update({
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
    getNextDayOfWeek() {
    var currentDate = new Date();
    var currentDay = currentDate.getDay(); // 获取当前星期几（0 表示星期日，1 表示星期一，以此类推）
    
    var daysUntilNextDayOfWeek = 4 - currentDay; // 计算距离下一个星期一的天数差值
    
    if (daysUntilNextDayOfWeek <= 0) {
        daysUntilNextDayOfWeek += 7; // 如果当前已经是星期一或之后的某天，则计算距离下一个星期一的天数差值需加上 7
    }
    
    var nextDayOfWeek = new Date(currentDate.getTime() + daysUntilNextMonday * 24 * 60 * 60 * 1000); // 根据天数差值计算出下一个星期一的日期
    console.log(nextDayOfWeek)
    return nextDayOfWeek;
    },



  })

