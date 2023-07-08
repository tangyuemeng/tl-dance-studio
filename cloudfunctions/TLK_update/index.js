// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    await db.collection('balance').add({ 
        data : {
        "userID": "app.globalData.userID",
        "way":"that.data.way",
        "count":"that.data.count",
        "date":"that.data.date",
        "content":"that.data.content",
        "id":"that.data.id"
      },
      success(){
        console.log('success')
      },
      fail:err => {
          console.log('error')
      }
    })

}