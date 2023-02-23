
var util = require('../../utils/util.js');
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({
  data: {
    num:app.globalData.num,
    userID : app.globalData.userID,
    TabCount: app.globalData.day,
    cardtype:app.globalData.cardtype,
    date:null,
    check:true,
    loadflag:false
  },

  async onLoad () {
    this.calculateWeek()
    this.setData({
        isshowloading : "none"
    })
    let result = await db.collection('User').get()
    let num = result.data[0].num
    if (app.globalData.cardtype != "受け放題"){
      if (num <= 0)
      {
        wx.showToast({
        title: '当月次数已用完',
        icon : 'error',
        duration : 1000,
        success:function() {
          setTimeout(function() {
            //要延时执行的代码
            wx.navigateBack({
              delta: 1
            })
          }, 1000) //延迟时间
        },
      })
      }
    }
  },

  dealTime: function (num) {     // num：未来天数
    var time = new Date()     // 获取当前时间日期
    var date = new Date(time.setDate(time.getDate() + num)).getDate()  //这里先获取日期，在按需求设置日期，最后获取需要的
    var month = time.getMonth() + 1   // 获取月份
    var day = time.getDay()   //  获取星期
    var id 
    switch (day) {             //  格式化
      case 0: day = "Sun", id  = 0
        break
      case 1: day = "Mon", id  = 1
        break
      case 2: day = "Tues", id  = 2
        break
      case 3: day = "Wed", id  = 3
        break
      case 4: day = "Thu", id  = 4
        break
      case 5: day = "Fri", id  = 5
        break
      case 6: day = "Sat", id  = 6
        break
    }
    var obj = {
      date: date,
      day: day,
      month: month,
      newday:month + '-' + date,
      id : id
    }
    return obj      // 返回对象
  },

  calculateWeek(){
    var arr = []
    for (let i = 0; i < 7; i++) {
      arr.push(this.dealTime(i))
    }
    this.setData({
      arr:arr
    })
  },

  check_flag:function(e){
    this.toggle()
    this.openAppointment(e)
    this.setData({
      check:false
    })
  },

  toggle(){
    this.setData({
        check:true
      })
  },
  
  async tabSelect(e) {
    var isshowloading
    var classlist
    this.setData({
        isshowloading : "block"
    })
    var xqj = String(e.currentTarget.dataset.id)
    this.data.date = e.currentTarget.dataset.date
    // this.hideModal()
    let result = await db.collection('classlist').where({xqj:xqj}).get()
    classlist = result.data
    for ( var i = 0 ; i < classlist.length ; i++) {
        let classcount = await db.collection('class').where({
                classid:classlist[i].id, 
            }).count()
        classlist[i].num = classcount.total
    }    
    this.setData({
      isshowloading : "none",
      classlist : classlist
    })
  },

  async openAppointment(e) {
    let date = this.data.date
    // let that = this
    if (this.data.check){
    // let result = await db.collection('class').where({
    //   classid:e.currentTarget.dataset.id, 
    //   date:date
    // }).count({})
    let count = e.currentTarget.dataset.num
    if (count > 15) 
    {  
      wx.showToast({
      title: '该课程已满员',
      icon : 'error'
     })
     this.setData({
      check:false
    })
    }
    else{
      let result = await db.collection('User').get()
      let num = result.data[0].num
      if (num > 0 || app.globalData.cardtype === "受け放題"){
      let classlist = await db.collection('class').where({
        classid:e.currentTarget.dataset.id,
        userID:app.globalData.userID
      }).get()
      console.log(classlist)
      if (classlist.data.length == 0) {
        wx.showModal({
          title:"确定预约吗？",
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
            if (res.confirm) {
              wx.showToast({
                title: '预约成功',
              })
              if (app.globalData.cardtype != "受け放題"){
              db.collection('User').where({
              }).update({
                data: {
                  num: _.inc(-1)
                },
              })
            }
              db.collection('class').add({ 
                data : {
                "classid": e.currentTarget.dataset.id,
                "userID" : app.globalData.userID,
                "time":e.currentTarget.dataset.time,
                "url":e.currentTarget.dataset.url,
                "style":e.currentTarget.dataset.style,
                "teacher":e.currentTarget.dataset.teacher,
                "date":date,
                "timestamp":e.currentTarget.dataset.timestamp,
                "checkin":false
              }
            }),
             db.collection('class-copy').add({ 
              data : {
              "classid": e.currentTarget.dataset.id,
              "userID" : app.globalData.userID,
              "time":e.currentTarget.dataset.time,
              "url":e.currentTarget.dataset.url,
              "style":e.currentTarget.dataset.style,
              "teacher":e.currentTarget.dataset.teacher,
              "date":date,
              "timestamp":e.currentTarget.dataset.timestamp
            }
          })
            } 
            that.setData({
              check:true
            })
          }
        })
      }
      else{
      wx.showToast({
        title: '该课程已预约',
       icon : 'error'
       })
       this.setData({
        check:true
      })
      }
    }
    else{
      wx.showToast({
        title: '当月次数已用完',
        icon : 'error',
        duration : 1000,
        success:function() {
          setTimeout(function() {
            //要延时执行的代码
            wx.redirectTo({
              url: '../home/home',
            })
          }, 1000) //延迟时间
        },
      })
    }
  }
}
},

    navi_home(){
        wx.navigateBack({
            delta: 1
          })
    }
})
