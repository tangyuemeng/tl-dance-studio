// pages/game/gane.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shitoujiandaobu : ['石头','剪刀','布'],
     
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let i = Math.floor(Math.random() * 3);
        console.log(i)
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

    },

    calculate(x,y){
        switch (x) {
            case 0:
                if (y == 0){
                    return "你赢了"
                }
                if (y == 1){
                    return "平手"
                }
                if (y == 2){
                    return "你输了"
                }
            break
            case 1:
                if (y == 0){
                    return "平手"
                }
                if (y == 1){
                    return "你输了"
                }
                if (y == 2){
                    return "你赢了"
                }
            break
            case 2:
                if (y == 0){
                    return "你输了"
                }
                if (y == 1){
                    return "你赢了"
                }
                if (y == 2){
                    return "平手"
                }
            break
        }
    },

    randomY(){
        let url= ['/images/2.png','/images/3.png','/images/4.png',]
        let i = Math.floor(Math.random() * 3);

        this.setData({
            url: url[i]
        })
        return i 
    },

    getresult(e){
        var result = e.currentTarget.dataset.result
        result = Number(result)
        var pc_result = this.randomY()
        // console.log(pc_result)
       var title = this.calculate(result,pc_result)
       this.setData({
           title:title
       })
    }
})