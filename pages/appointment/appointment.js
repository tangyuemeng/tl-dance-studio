
var util = require('../../utils/util.js');
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    num:app.globalData.num,
    userID : app.globalData.userID,
    TabCount: app.globalData.day,
    cardtype:app.globalData.cardtype,
    date:null,
    check:true,
    week:[{"w1":"日","w2":""},{"w1":"一","w2":""},{"w1":"二","w2":""},{"w1":"三","w2":""},{"w1":"四","w2":""},{"w1":"五","w2":""},{"w1":"六","w2":""}],
    classweek:[{'xqj':'0','id':'15'},{'xqj':'0','id':'16'},{'xqj':'0','id':'17'},{'xqj':'0','id':'18'},{'xqj':'2','id':'1'},{'xqj':'2','id':'2'},{'xqj':'3','id':'3'},{'xqj':'3','id':'4'},{'xqj':'4','id':'5'},{'xqj':'4','id':'6'},{'xqj':'4','id':'7'},{'xqj':'5','id':'0'},{'xqj':'5','id':'8'},{'xqj':'5','id':'9'},{'xqj':'6','id':'10'},{'xqj':'6','id':'11'},{'xqj':'6','id':'12'},{'xqj':'6','id':'13'},{'xqj':'6','id':'14'}],
    aWeek:[],
    loadProgress:0,
    loadflag:false
  },

  async onLoad () {
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
    var arr = []
    for (let i = 0; i < 7; i++) {
      arr.push(this.dealTime(i))
    }
    this.setData({
      aWeek: arr            // 赋值给data
    },()=>{
    })
    let res = await db.collection('Info').get()
    let text = res.data[0].text
    this.setData({
      text:text
    })
  },

  dealTime: function (num) {     // num：未来天数
    var time = new Date()     // 获取当前时间日期
    var date = new Date(time.setDate(time.getDate() + num)).getDate()  //这里先获取日期，在按需求设置日期，最后获取需要的
    var month = time.getMonth() + 1   // 获取月份
    var day = time.getDay()   //  获取星期
    var id 
    switch (day) {             //  格式化
      case 0: day = "周日", id  = 0
        break
      case 1: day = "周一", id  = 1
        break
      case 2: day = "周二", id  = 2
        break
      case 3: day = "周三", id  = 3
        break
      case 4: day = "周四", id  = 4
        break
      case 5: day = "周五", id  = 5
        break
      case 6: day = "周六", id  = 6
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
  takeclass : function(e){
   
  },

  check_flag:function(e){
    this.toggle(e)
    this.openAppointment(e)
    this.setData({
      check:false
    })
  },
  
  async tabSelect(e) {
    this.data.loadflag = false
    console.log(this.data.classweek)
    this.loadProgress()
    var classlist
    var index = 0
    var xqj = String(e.currentTarget.dataset.id)
    this.setData({
      TabCount: e.currentTarget.dataset.id
    })
    // this.setData({
    //   TabCur: e.currentTarget.dataset.week,
    // })
    this.hideModal()
    let result = await db.collection('classlist').where({xqj:xqj}).get()
    classlist = result.data
    for ( var i = 0 ; i < this.data.classweek.length ; i++) {
        if (this.data.classweek[i].xqj == xqj){
            console.log(this.data.classweek[i].id)
            let classcount = await db.collection('class').where({
                 classid:this.data.classweek[i].id, 
               }).count()
            classlist[index].num = classcount.total
            index += 1 
        }
    }
    console.log(classlist)
    this.data.date= this.data.aWeek[e.currentTarget.dataset.week].newday
 
    this.setData({
      classlist : classlist
    })
  },

  async openAppointment(e) {
    var date = this.data.date
    let that = this
    if (this.data.check){
    let result = await db.collection('class').where({
      classid:e.currentTarget.dataset.id, 
      date:date
    }).count({})
    let num = result.total
    if (num > 15) 
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
            wx.navigateBack({
              delta: 1
            })
          }, 1000) //延迟时间
        },
      })
    }
  }
}
},
    showModal(e) {
      var that = this
      var toggle1 
      this.setData({
        modalName: e.currentTarget.dataset.target,
        toggle:true
      })
      setTimeout(function() {
        that.setData({
          toggle1: false
        })
      }, 1000)
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },



})
