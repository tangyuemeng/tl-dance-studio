
const app = getApp()
const db = wx.cloud.database()
Page({ 
  data:{
    week:[{"w1":"日","w2":""},{"w1":"一","w2":""},{"w1":"二","w2":""},{"w1":"三","w2":""},{"w1":"四","w2":""},{"w1":"五","w2":""},{"w1":"六","w2":""}],
    },

    onLoad: function (options) {
      var classlist
      db.collection('classlist').get().then(res => {
        classlist = res.data
        console.log(res.data)
          this.setData({
            classlist:classlist
          })
      })
    },

  tabSelect(e) {
    var TabCur
    this.setData({
      TabCount: e.currentTarget.dataset.id
    })
    this.setData({
      TabCur: e.currentTarget.dataset.week,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })

    this.setData({
      loadModal: true
    })
    setTimeout(()=> {
      this.setData({
        loadModal: false
      })
    }, 100)
 
  },
})