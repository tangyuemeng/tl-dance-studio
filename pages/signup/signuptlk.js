// pages/signup/signup.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    course: "",
    checked: false,
    items: [
      { value: "3000", name: "次卡" },
      { value: "10000", name: "月卡", checked: "true" },
      { value: "25000", name: "季卡" },
      { value: "45000", name: "半年卡" },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  radioChange(e) {
    const items = this.data.items;
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value;
    }
    this.setData({
      items,
      course: e.detail.value,
    });
  },


  nameInput: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value,
    });
  },

  downloadAndOpenFile: function () {
    // 云存储中的文件路径，需要根据你的实际路径进行设置
    const cloudFilePath =
      "cloud://tl-dance-studio-4gg36ntka3d1473f.746c-tl-dance-studio-4gg36ntka3d1473f-1304999845/会员登记表 (1).pdf";

    // 使用云开发的下载文件 API 下载文件
    wx.cloud.downloadFile({
      fileID: cloudFilePath,
      success: (res) => {
        const tempFilePath = res.tempFilePath;

        // 使用微信内置的文件查看器打开文件
        wx.openDocument({
          filePath: tempFilePath,
          success: (res) => {
            console.log("文件打开成功");
          },
          fail: (error) => {
            console.error("文件打开失败", error);
          },
        });
      },
      fail: (error) => {
        console.error("文件下载失败", error);
      },
    });
  },

  changeCheck() {
    this.data.checked = true;
  },

  navi_home() {
    wx.navigateBack({
      delta: 1,
    });
  },

  onSignup() {
    if (
      this.data.name != "" &&
      this.data.phone != "" &&
      this.data.course != "" &&
      this.data.checked
    ) {
      this.createNewId();
      db.collection("newuser").add({
        data: {
          userID: app.globalData.userID,
          name: this.data.name,
          course: this.data.course,
        },
      });
      wx.navigateTo({
        url: "../signup/signupfinished",
      });
    } else {
      wx.showToast({
        icon: "error",
        title: "请填写所有内容",
      });
    }
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

  createNewId() {
    if (!app.globalData.islogin) {
      var date = new Date(); // 获取当前时间日期
      var month = (date.getMonth() + 1).toString(); // 获取月份
      var day = date.getDate().toString(); //  获取星期
      var year = date.getFullYear().toString();
      day = this.changestringlength(day);
      month = this.changestringlength(month);
      year = year.substr(2, 2);
      let userID =
        "TLK" + year + month + day + Math.random().toString().substr(2, 2);
      app.globalData.userID = userID;
      app.globalData.islogin = true;
      db.collection("User-TLK").add({
        data: {
          vip: false,
          userID: userID,
          name: this.data.name,
          campus: "大久保店",
        },
      });
    }
  },
});
