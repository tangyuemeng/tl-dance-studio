// miniprogram/pages/home.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({
  options: {
    addGlobalClass: true,
    Custom: app.globalData.Custom
  },
  data: {
      classlist:[]
  },

  async onLoad() {
    if ( app.globalData.campus == app.globalData.school){
        app.globalData.isRight = true
    }
    else{
        app.globalData.isRight = false
    }
    var logo = ""
    var title = ""
    var subtitle = ""
    if (app.globalData.school != "大久保店"){
        this.setData({
            logo:"TLK",
            title:"Scheduled Class",
            subtitle:"我的课程"
        })
    }
    else{
        this.setData({
            logo:" BUZZ TL",
            title:"Popup Class",
            subtitle:"我的预约"
        })
    }
    var listname = ""   
    switch(app.globalData.school){
        case "大久保店":
            listname = "classlist"
            break
        case "池袋店":
            listname= "classlist-ikebukuro"  
            break    
        case "新小岩店":
            listname = "classlist-shinkoiwako"    
            break
        default:
            listname= "classlist"
           
    }
    let response = await db.collection(listname).get()
    this.data.classlist = response.data
    this.randomClass()
    this.setData({
        userID : app.globalData.userID,
        school : app.globalData.school
    })
  },

   randomClass(){
    let result = this.data.classlist
    let i = Math.floor(Math.random() * result.length);
    var popupclass = result[i]
    switch(popupclass.xqj){
        case "0":
            popupclass.xqj = "Sunday"
            break
        case "1":
            popupclass.xqj = "Monday"
            break
        case "2":
            popupclass.xqj = "Tuesday"
            break   
        case "3":
            popupclass.xqj = "Wednesday"
            break
        case "4":
            popupclass.xqj = "Thursday"
            break
        case "5":
            popupclass.xqj = "Friday"
            break            
        case "6":
            popupclass.xqj = "Saturday"
            break      
    }
    this.setData({
        popupclass:popupclass
    })
  },

  navi_setting(){
      wx.redirectTo({
        url: '/pages/userinfo/userinfo',
      })
  },

  navi_class(){
    if(app.globalData.campus == "大久保店"){
        if (app.globalData.vip){
            wx.navigateTo({
                url: '/pages/appointment/appointment',
            })
        }
        else{
            wx.showToast({
                title: '会员卡已过期',
                icon:"error"
            })    
        }
    }
    else{
        wx.showToast({
            title: '当前校区不支持',
            icon:"error"
        }) 
    }

  },

  onSignup(){
    if (!app.globalData.islogin){
        var date = new Date()     // 获取当前时间日期
        var month = (date.getMonth() + 1).toString()   // 获取月份
        var day = date.getDate().toString()//  获取星期
        var year = date.getFullYear().toString()
        day = this.changestringlength(day)
        month = this.changestringlength(month)
        year = year.substr(2,2)
        let userID = "TLK" + year + month + day + Math.random().toString().substr(2, 2)
        app.globalData.userID = userID 
        app.globalData.islogin = true
        db.collection('User-TLK').add({
           data:{
             "vip": false,
             "userID" : userID,
             "campus" : app.globalData.school
           }
         })
         wx.showToast({
            title: '会员卡创建成功',
          })
      }
      else{
          wx.showToast({
            title: '会员卡创建失败',
            icon : 'error',
          })
      }
  },

  changestringlength (e){
    var result 
    if (e.length === 1){
      result = "0" + e
      return result
    }
    else {
      return e 
    }
  },

  navi_shop(){
    if(app.globalData.campus == "大久保店"){
        wx.navigateTo({
            url: '/pages/shop/shop',
        })
    }
    else{
        wx.showToast({
            title: '当前校区不支持',
            icon:"error"
        }) 
    }
  },

  navi_book(){
    if(app.globalData.campus == "大久保店"){
        wx.navigateTo({
            url: '/pages/myappointment/myappointment',
        })
    }
    if(app.globalData.campus == "池袋店" || app.globalData.campus == "新小岩店"){
        if (app.globalData.vip){
            wx.navigateTo({
                url: '/pages/TLK/mybook',
            })
        }
        else{
            wx.showToast({
                title: '会员卡已过期',
                icon:"error"
            })    
        }
    }
    },
})