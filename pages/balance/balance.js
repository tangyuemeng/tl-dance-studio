// pages/balance/balance.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
    data: {
        content:"",
        id:"",
        date:Date(),
        count:Number,
        way:"",
        items: [
            {value: '转账', name: '转账'},
            {value: '现金', name: '现金', checked: 'true'},
            {value: 'Paypay', name: 'Paypay'},
            {value: '微信', name: '微信'},
            {value: '支付宝', name: '支付宝'},
            {value: '信用卡', name: '信用卡'},
          ]
    },

    onLoad(){
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()
        this.setData({
            date:year+'-'+month+'-'+day
        })
    },

    radioChange(e) {
        const items = this.data.items
        for (let i = 0, len = items.length; i < len; ++i) {
          items[i].checked = items[i].value === e.detail.value
        }
        this.setData({
          items,
          way:e.detail.value
        })
        console.log(this.data.way )
      },

    idInput: function (e) {
    this.setData({
        id: e.detail.value
    })
    },

    contentInput: function (e) {
    this.setData({
        content: e.detail.value
    })
    },

    countInput: function (e) {
        this.setData({
            count: e.detail.value
        })
    },

    upload(){
        var that = this
        wx.showModal({
            title:"确定提交吗？",
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
              if (res.confirm) {
                db.collection('balance').add({ 
                  data : {
                  "userID": app.globalData.userID,
                  "way":that.data.way,
                  "count":that.data.count,
                  "date":that.data.date,
                  "content":that.data.content
                }
              })
            }
        }})
    },

    navi_home(){
        wx.navigateBack({
            delta:1
        })
      },
})