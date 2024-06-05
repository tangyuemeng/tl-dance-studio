// pages/queueme/welcome.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        count: 0,
        filePath: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    increment() {
        if (this.data.count > 23){
            return
        }

        this.setData({
          count: this.data.count + 1
        });
        this.triggerEvent('change', { count: this.data.count });
      },

    decrement() {
        if (this.data.count == 0){
            return
        }
        this.setData({
            count: this.data.count - 1
        });
        this.triggerEvent('change', { count: this.data.count });
    },

    upload(){
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success: (res) => {
              const tempFilePaths = res.tempFiles.map(file => file.path);
              this.setData({
                filePath: tempFilePaths[0]
              });
              console.log('Selected file temporary path:', tempFilePaths[0]);
            },
            fail: (err) => {
              console.error('Failed to choose file:', err);
            }
          });
    },

    ready(){
        wx.redirectTo({
          url: '/pages/queueme/queueme?count=' + this.data.count + '&filePath=' + this.data.filePath,
        })
    }
})