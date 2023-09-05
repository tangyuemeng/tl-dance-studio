// pages/TLK/mybook.js
// miniprogram/pages/home.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({
    data: {

    },

   async onLoad() {
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
    var listname = ""   
    switch(app.globalData.school){
        case "池袋店":
            listname= "classlist-ikebukuro"  
            break    
        case "新小岩店":
            listname = "classlist-shinkoiwako"    
            break
        default:
            listname= "classlist-ikebukuro"
    }
    let response = await db.collection(listname).get()
    let array = response.data
    for (var element of array) {
        var xqj = element.xqj
        element.date = this.findNextday(xqj)
    }
    this.setData({array})
    this.findNextday(1)
    },

    findNextday(e){
        const currentDate = new Date()
        const currentDay = currentDate.getDay()
        const daysUntilnext = (e - currentDay + 7) % 7
    
        currentDate.setDate(currentDate.getDate() + daysUntilnext)

        let month = currentDate.getMonth()+1 
        let date = currentDate.getDate()
        let showDate = month + '-' + date
        return showDate
    },
    async deleteclass(e){
        let result = await db.collection('abend').where({
            date : e.currentTarget.dataset.date,
            campus : app.globalData.campus,
            userID : app.globalData.userID,
        }).get()
        var time = new Date()
        var date = new Date(time.setDate(time.getDate() + 0)).getDate()
        var month = time.getMonth() + 1
        var hour = new Date().getHours();
        var day = time.getDay()
        date = month + '-' + date
        if ( app.globalData.allowedNum < 1 )   
        {
          wx.showToast({
            title: '请假次数不足',
            icon : 'error'
            })
            return
        }
        if (result.data.length == 0){
            wx.showModal({
                content: '确定请假吗？',
                confirmText: "确定",
                cancelText: "取消",
                success:function(res){
                if (res.confirm){
                    wx.showToast({
                        title: '请假成功',
                        icon : 'success'
                        })   
                    db.collection('User-TLK').where({userID:app.globalData.userID}).update({
                        data: {
                            allowedNum: _.inc(-1)
                        },
                    })
                    db.collection('abend').add({
                        data: {
                            userID : app.globalData.userID,
                            xqj : day,
                            date : e.currentTarget.dataset.date,
                            campus : app.globalData.campus,
                            teacher : e.currentTarget.dataset.teacher,
                            style : e.currentTarget.dataset.style,
                            time : e.currentTarget.dataset.time,
                            name:app.globalData.name
                        }
                    })
                    wx.navigateBack({
                        delta: 1,
                    })
                }
            }
            })
            }
        else{
            wx.showToast({
              icon:'error',
              title: '已经请假',
            })
        }
        },
    navi_home(){
        wx.navigateBack({
            delta:1
        })
      },
})