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
            // TLK会员
            let result = await db.collection("User-TLK").get();
            if (result.data.length === 0) {
                app.globalData.islogin = false;
                app.globalData.userID = "********";
                app.globalData.vip = false;
                app.globalData.cardtype = "****";
                app.globalData.num = 0;
                app.globalData.point = 0;
                app.globalData.school = "BUZZ TL"
            } else {
                app.globalData.islogin = true;
                app.globalData.userID = result.data[0].userID;
                app.globalData.vip = result.data[0].vip;
                app.globalData.cardtype = result.data[0].cardtype ?
                    result.data[0].cardtype :
                    "新规套餐";
                app.globalData.num = result.data[0].num;
                app.globalData.allowedNum = result.data[0].allowedNum;
                app.globalData.campus = result.data[0].campus;
                app.globalData.name = result.data[0].name ? result.data[0].name : "";
                app.globalData.school = "TLK"
            }
        } else {
            app.globalData.islogin = true;
            app.globalData.userID = result.data[0].userID;
            app.globalData.vip = result.data[0].vip;
            app.globalData.cardtype = result.data[0].cardtype ?
                result.data[0].cardtype :
                "新规套餐";
            app.globalData.num = result.data[0].num;
            app.globalData.point = result.data[0].point ? result.data[0].point : 0;
            app.globalData.campus = result.data[0].campus;
            app.globalData.name = result.data[0].name ? result.data[0].name : "";
            app.globalData.isPaused = result.data[0].isPaused;
            app.globalData.school = "BUZZ TL"
        }
    },


    loginApi(e) {
        switch (e.currentTarget.dataset.target) {
            case "BUZZ TL":
                if (app.globalData.school == "BUZZ TL") {
                    wx.redirectTo({
                        url: "/pages/home/home",
                    });
                } else {
                    wx.showToast({
                        title: "校区选择错误",
                        icon: "error",
                    });
                }
                break;
            case "TLK":
                if (app.globalData.school == "TLK") {
                    wx.redirectTo({
                        url: "/pages/TLK/home/home",
                    });
                } else {
                    wx.showToast({
                        title: "校区选择错误",
                        icon: "error",
                    });
                }
                break;
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

    hideTemporaryModal(e) {
        this.setData({
            temporaryModelName: e.currentTarget.dataset.target,
        });
    },

    naviSignup() {
        // 判断该用户是否已经登陆过
        if (!app.globalData.islogin) {
            wx.showActionSheet({
                itemList: ["BUZZ TL", "TLK"],
                success(res) {
                    if (res.tapIndex == 0) {
                        wx.navigateTo({
                            url: "../signup/signup",
                        })
                    } else {
                        wx.navigateTo({
                            url: "../signup/signuptlk",
                        })
                    }
                },
                fail(res) {
                    console.log(res.errMsg);
                },
            });
        }
    },
    // 公演报名接口
    // naviDanceEvent() {
    //     wx.navigateTo({
    //         url: "../danceEvent/event",
    //     })
    // }
});