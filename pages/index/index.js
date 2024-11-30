Page({
  data: {
    todayCount: 0,
    todayCalories: 0
  },
  onShow() {
    this.calculateTodayStats()
  },
  calculateTodayStats() {
    const app = getApp()
    const today = new Date().toLocaleDateString()
    const todayRecords = app.globalData.teaRecords.filter(record => 
      new Date(record.date).toLocaleDateString() === today
    )
    
    this.setData({
      todayCount: todayRecords.length,
      todayCalories: todayRecords.reduce((sum, record) => sum + (record.calories || 0), 0)
    })
  },
  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
    })
  }
}) 