// pages/signup/signup.js
const app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickname:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(app.globalData.userID)
        this.setData({
            userID:app.globalData.userID
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    nicknameinput(e){
        this.setData({
          nickname: e.detail.value
        })
      },

      saveinfo(){
        app.globalData.nickName = this.data.nickname
        console.log(this.data.nickname)
        db.collection('User').where({userID:app.globalData.userID}).update({ 
          data : {
          "nickName":this.data.nickname,
        }
      })
        wx.showToast({
            title: '保存成功',
            icon : 'check'
        })
        wx.navigateTo({
        url: '/pages/index/index',
        })
      },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})