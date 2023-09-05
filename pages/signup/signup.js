// pages/signup/signup.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { value: "5500", name: "月2回套餐" },
      { value: "8800", name: "月4回套餐", checked: "true" },
      { value: "16500", name: "月8回套餐" },
      { value: "19800", name: "放题套餐" },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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
});
