const app = getApp();
const db = wx.cloud.database();
Page({
  data: {},
  async onLoad() {
    var time = new Date(); // 获取当前时间日期
    var day = time.getDay(); //  获取星期
    app.globalData.day = day;
    let result = await db.collection("User").get();
    if (result.data.length === 0) {
      // not ookubo user
      let result = await db.collection("User-TLK").get();
      if (result.data.length === 0) {
        app.globalData.islogin = false;
        app.globalData.userID = "********";
        app.globalData.vip = false;
        app.globalData.cardtype = "****";
        app.globalData.num = 0;
        app.globalData.point = 0;
      } else {
        app.globalData.islogin = true;
        app.globalData.userID = result.data[0].userID;
        app.globalData.vip = result.data[0].vip;
        app.globalData.cardtype = result.data[0].cardtype
          ? result.data[0].cardtype
          : "新规套餐";
        app.globalData.num = result.data[0].num;
        app.globalData.allowedNum = result.data[0].allowedNum;
        app.globalData.isWeek = result.data[0].isWeek;
        app.globalData.campus = result.data[0].campus;
        app.globalData.name = result.data[0].name ? result.data[0].name : "";
      }
    } else {
      app.globalData.islogin = true;
      app.globalData.userID = result.data[0].userID;
      app.globalData.vip = result.data[0].vip;
      app.globalData.cardtype = result.data[0].cardtype
        ? result.data[0].cardtype
        : "新规套餐";
      app.globalData.num = result.data[0].num;
      app.globalData.point = result.data[0].point ? result.data[0].point : 0;
      app.globalData.campus = result.data[0].campus;
      app.globalData.name = result.data[0].name ? result.data[0].name : "";
    }
  },

  Onsignup() {
    if (!app.globalData.islogin) {
      var date = new Date(); // 获取当前时间日期
      var month = (date.getMonth() + 1).toString(); // 获取月份
      var day = date.getDate().toString(); //  获取星期
      var year = date.getFullYear().toString();
      day = this.changestringlength(day);
      month = this.changestringlength(month);
      year = year.substr(2, 2);
      let userID =
        "TL" + year + month + day + Math.random().toString().substr(2, 2);
      app.globalData.userID = userID;
      app.globalData.islogin = true;
      db.collection("User").add({
        data: {
          vip: false,
          userID: userID,
          campus: "大久保店",
        },
      });
      wx.showToast({
        title: "会员卡创建成功",
      });
    } else {
      wx.showToast({
        title: "会员卡创建失败",
        icon: "error",
      });
    }
    this.hideModal();
  },

  loginApi(e) {
    console.log(e.currentTarget.dataset.target);
    switch (e.currentTarget.dataset.target) {
      case "ookubo":
        app.globalData.school = "大久保店";
        break;
      case "ikebukuro":
        app.globalData.school = "池袋店";
        break;
      case "shinkoiwako":
        app.globalData.school = "新小岩店";
        break;
      default:
        app.globalData.school = "error";
    }
    wx.redirectTo({
      url: "/pages/home/home",
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

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
    });
  },

  hideModal() {
    this.setData({
      modalName: "",
    });
  },

  naviSignup() {
    // 判断该用户是否已经登陆过
    if (!app.globalData.islogin) {
      wx.navigateTo({
        url: "../signup/signup",
      });
    }
  },
});
