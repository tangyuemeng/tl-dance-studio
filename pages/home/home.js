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
    if (app.globalData.school != "大久保店"){
        this.setData({
            logo:"TLK",
            title:"Scheduled Class"
        })
    }
    else{
        this.setData({
            logo:" BUZZ TL",
            title:"Popup Class"
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
      console.log(app.globalData.school)
    if(app.globalData.isRight){
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
            title: '校区选择错误',
            icon:"error"
        }) 
    }

  },

  navi_shop(){
    wx.navigateTo({
        url: '/pages/shop/shop',
      })
  },

  navi_book(){
    console.log(app.globalData.campus)
    if(app.globalData.isRight){
        wx.navigateTo({
            url: '/pages/myappointment/myappointment',
        })
        }
        else{
            wx.showToast({
                title: '校区选择错误',
                icon:"error"
            }) 
        }
    },
})