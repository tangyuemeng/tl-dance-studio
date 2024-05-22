// pages/TLK/home/home.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0, // 当前选项卡索引，默认是第一个选项卡
        classList: []
    },

    switchTab(e) {
        this.setData({
            currentTab: e.currentTarget.dataset.index
        });
        if (e.currentTarget.dataset.index == 1) {
            this.loadRecord()
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        this.refresh()
    },

    async refresh() {
        let result = await db.collection("User-TLK").get();
        if (result.data.length === 0) {
            app.globalData.islogin = false;
            app.globalData.userID = "********";
            app.globalData.vip = false;
            app.globalData.cardtype = "****";
            app.globalData.num = 0;
            app.globalData.point = 0;
            app.globalData.school = "TLK"
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
            app.globalData.school = "TLK";
            app.globalData.pauseDate = result.data[0].pauseDate;
            app.globalData.classes = result.data[0].classes;
            app.globalData.level = result.data[0].level;
        }
        if (app.globalData.pauseDate) {
            var pauseDate = this.formatDate(app.globalData.pauseDate)
        }
        let listResult = await db.collection("classlist-TLK").get();
        if (app.globalData.classes) {
            var classList = this.transformClass(listResult.data, app.globalData.classes)
            classList = this.transformDate(classList)
        }
        this.setData({
            userID: app.globalData.userID,
            cardtype: app.globalData.cardtype,
            num: app.globalData.num,
            allowedNum: app.globalData.allowedNum,
            level: app.globalData.level,
            campus: app.globalData.campus,
            pauseDate: pauseDate,
            classList: classList
        })
    },

    async loadRecord() {
        let result = await db.collection("record-TLK").where({
            userID: app.globalData.userID,
        }).get();
        this.setData({
            record: result.data
        })
    },

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    },

    transformClass(classlist, classes) {
        // 过滤 classlist 数组，找到 classid 属性与 classes 数组中的某个字符串相同的项
        const filteredClassList = classlist.filter(item => classes.includes(item.classId));

        // 返回过滤后的 classlist 列表
        return filteredClassList;
    },

    transformDate(classlist) {
        classlist.forEach(item => {
            item.date = this.findNextday(item.xqj);
        });
        return classlist
    },

    findNextday(num) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const daysUntilnext = (num - currentDay + 7) % 7;

        currentDate.setDate(currentDate.getDate() + daysUntilnext);

        let month = currentDate.getMonth() + 1;
        let date = currentDate.getDate();
        let showDate = month + "-" + date;
        return showDate;
    },

    async atendClass(e) {
        if (app.globalData.num > 0) {
            let result = await db.collection("record-TLK")
                .where({
                    userID: app.globalData.userID,
                    date: e.currentTarget.dataset.date
                })
                .get();
            if (result.data.length == 0) {
                //没有约过这节课
                wx.showModal({
                    title: "确定出席吗？",
                    confirmText: "确定",
                    cancelText: "取消",
                    success: function (res) {
                        if (res.confirm) {
                            wx.showToast({
                                title: "预约成功",
                            });
                            db.collection("User-TLK")
                                .where({})
                                .update({
                                    data: {
                                        num: _.inc(-1),
                                    },
                                });
                            db.collection("record-TLK").add({
                                data: {
                                    userID: app.globalData.userID,
                                    name: app.globalData.name,
                                    style: e.currentTarget.dataset.style,
                                    date: e.currentTarget.dataset.date,
                                    checkin: "出席",
                                },
                            })
                        }
                    },
                })
            } else {
                wx.showToast({
                    title: "该课程已出席",
                    icon: "error",
                });
            }
        } else {
            wx.showToast({
                title: "次数已用完",
                icon: "error",
            });
        }
        this.refresh()
    },

    async leaveClass(e) {
        if (app.globalData.allowedNum > 0) {
            let result = await db.collection("record-TLK")
                .where({
                    userID: app.globalData.userID,
                    date: e.currentTarget.dataset.date
                })
                .get();
            if (result.data.length == 0) {
                //没有约过这节课
                wx.showModal({
                    title: "确定请假吗？",
                    confirmText: "确定",
                    cancelText: "取消",
                    success: function (res) {
                        if (res.confirm) {
                            wx.showToast({
                                title: "请假成功",
                            });
                            db.collection("User-TLK")
                                .where({})
                                .update({
                                    data: {
                                        allowedNum: _.inc(-1),
                                    },
                                });
                            db.collection("record-TLK").add({
                                data: {
                                    userID: app.globalData.userID,
                                    name: app.globalData.name,
                                    style: e.currentTarget.dataset.style,
                                    date: e.currentTarget.dataset.date,
                                    checkin: "请假",
                                },
                            })
                        }
                    },
                })
            } else {
                wx.showToast({
                    title: "该课程已请假",
                    icon: "error",
                });
            }
        } else {
            wx.showToast({
                title: "次数已用完",
                icon: "error",
            });
        }
        this.refresh()
    },

    async restClass(e) {
        console.log(e.currentTarget.dataset.id)
        if (e.currentTarget.dataset.isRest) {
            db.collection("classlist-TLK")
                .where({
                    classId: e.currentTarget.dataset.id
                })
                .update({
                    data: {
                        isRest: false,
                    },
                });
        } else {
            db.collection("classlist-TLK")
                .where({
                    classId: e.currentTarget.dataset.id
                })
                .update({
                    data: {
                        isRest: true,
                    },
                });
        }
        this.refresh()
    }
})