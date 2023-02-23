// miniprogram/pages/shop/mygoods.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () {
    let result = await db.collection('shop').get()
    let list = result.data
    console.log(list)
    this.setData({
      list:list
    })
  },
})