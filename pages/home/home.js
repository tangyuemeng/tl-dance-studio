// miniprogram/pages/home.js
const db = wx.cloud.database();
const app = getApp();
const _ = db.command;
Page({
  options: {
    addGlobalClass: true,
    Custom: app.globalData.Custom,
  },
  data: {
    classlist: [],
  },

  async onLoad() {
    var logo = "";
    var title = "";
    var subtitle = "";
      this.setData({
        logo: " BUZZ TL",
        title: "Popup Class",
        subtitle: "我的预约",
        userID: app.globalData.userID,
      });
    let response = await db.collection("classlist").get();
    this.data.classlist = response.data;
    this.randomClass();
  },

  randomClass() {
    let result = this.data.classlist;
    let i = Math.floor(Math.random() * result.length);
    var popupclass = result[i];
    switch (popupclass.xqj) {
      case "0":
        popupclass.xqj = "Sunday";
        break;
      case "1":
        popupclass.xqj = "Monday";
        break;
      case "2":
        popupclass.xqj = "Tuesday";
        break;
      case "3":
        popupclass.xqj = "Wednesday";
        break;
      case "4":
        popupclass.xqj = "Thursday";
        break;
      case "5":
        popupclass.xqj = "Friday";
        break;
      case "6":
        popupclass.xqj = "Saturday";
        break;
    }
    this.setData({
      popupclass: popupclass,
    });
  },

  changestringlength(e) {
    var result;
    if (e.length === 1) {
      result = "0" + e;
      return result;
    } else {
      return e;
    }
  },

  naviSetting() {
    wx.redirectTo({
      url: "/pages/userinfo/userinfo",
    });
  },

  naviClass() {
    this.handleNavigation("/pages/appointment/appointment")
},

  naviShop() {
    this.handleNavigation("/pages/shop/shop")
  },

  naviBook() {
    this.handleNavigation("/pages/myappointment/myappointment")
  },

  handleNavigation(url) {
    if (app.globalData.vip) {
      wx.navigateTo({ url });
    } else {
      wx.showToast({
        title: "会员卡已过期",
        icon: "error",
      });
    }
  }
});
