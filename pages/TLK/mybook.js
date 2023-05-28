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
    
    navi_home(){
        wx.navigateBack({
            delta:1
        })
      },
})