//app.js
App({
  globalData:{    
    vip : true,
    userID:null,
    num:0,
    cardtype:null,
    name:null,
    nickName:null,
    point:0,
    islogin:false,
    day:0,
    deadday:null,
    school:""
} , 
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'tl-dance-studio-4gg36ntka3d1473f',
    
      })
    }
    this.globalData = {}
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    wx.loadFontFace({
        family: 'Prompt',
        source: 'url("https://github.com/tangyuemeng/IOS-UI/blob/main/Prompt-Black.ttf")',
        success: res => {
            console.log('font load success', res)
          },
          fail: err => {
            console.log('font load fail', err)
          }
      })
  },

})
