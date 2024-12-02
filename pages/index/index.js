Page({
  data: {
    todayCount: 0,
    todayCalories: 0
  },
  onShow() {
    this.calculateTodayStats()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  calculateTodayStats() {
    const records = wx.getStorageSync('teaRecords') || [];
    const today = new Date().toDateString();
    const todayRecords = records.filter(record => 
      new Date(record.date).toDateString() === today
    );
    
    this.setData({
      todayCount: todayRecords.length,
      todayCalories: todayRecords.reduce((sum, record) => sum + (parseInt(record.calories) || 0), 0)
    });
  },
  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
    })
  }
}) 