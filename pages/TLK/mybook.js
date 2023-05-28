// pages/TLK/mybook.js
// miniprogram/pages/home.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({
    data: {

    },

   async onLoad() {
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
            content: '确定请假吗？',
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
    navi_home(){
        wx.navigateBack({
            delta:1
        })
      },
})