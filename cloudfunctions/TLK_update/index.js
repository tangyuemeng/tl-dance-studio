// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    await db.collection('User-TLK').where({
        vip:true,
        campus:event.campus
    }).update({
      data: {
        num: _.inc(-1)
      },
      success(){
        console.log('success')
      },
      fail:err => {
          console.log('error')
      }
    })

}