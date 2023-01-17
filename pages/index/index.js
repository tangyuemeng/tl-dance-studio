
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {

  
  },
  async onLoad() {
    var time = new Date()     // 获取当前时间日期
    var day = time.getDay()   //  获取星期
    app.globalData.day = day
    let result = await db.collection('User').get()
    if (result.data.length === 0){
      app.globalData.islogin = false
    }
    else{
    app.globalData.islogin = true
    app.globalData.userID = result.data[0].userID
    app.globalData.vip = result.data[0].vip
    app.globalData.cardtype = result.data[0].cardtype ? result.data[0].cardtype : "新规套餐"
    app.globalData.num = result.data[0].num
    app.globalData.nickName = result.data[0].nickName
    app.globalData.name = result.data[0].name
    app.globalData.phonenum = result.data[0].phonenum
    app.globalData.email = result.data[0].email
    app.globalData.point = result.data[0].point ? result.data[0].point : 0
    console.log(app.globalData.userID)
    console.log(app.globalData.vip)
    console.log(app.globalData.cardtype)
    console.log(app.globalData.num)
    console.log(app.globalData.nickName)
    }
  },
  imgloading(){
    console.log("loading")

  },

  Onlogin(){
    if (!app.globalData.islogin){
        wx.showToast({
            title: '新会员请先注册',
            icon : 'error'
           })
    }
    else{
      if (app.globalData.vip){
        wx.redirectTo({
        url: '/pages/home/home', 
          })
      }
      else{
        wx.showToast({
          title: '会员卡已过期',
          icon : 'error'
         })
      }
    }
  },

  Onsignup(){
    if (!app.globalData.islogin){
        var date = new Date()     // 获取当前时间日期
        var month = (date.getMonth() + 1).toString()   // 获取月份
        var day = date.getDate().toString()//  获取星期
        var year = date.getFullYear().toString()
        day = this.changestringlength(day)
        month = this.changestringlength(month)
        year = year.substr(2,2)
        let userID = "TL" + year + month + day + Math.random().toString().substr(2, 2)
        app.globalData.userID = userID 
        app.globalData.islogin = true
        db.collection('User').add({
           data:{
             "vip": false,
             "userID" : userID
           }
         })
         wx.navigateTo({
            url: '/pages/signup/signup', 
            })
      }
      else{
        wx.navigateTo({
            url: '/pages/signup/signup', 
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
})


