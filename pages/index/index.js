Page({
  data: {
    todayCount: 0,
    todayCalories: 0,
    todayAmount: 0,
    monthlySavings: 0,
    averagePrice: 0,
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
    
    const todayAmount = todayRecords.reduce((sum, record) => sum + (parseFloat(record.price) || 0), 0);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear;
    });

    const marketPrices = {
      '瑞幸咖啡': 19,
      '星巴克': 32,
      '霸王茶姬': 16,
      '蜜雪冰城': 7,
      '喜茶': 25,
      '奈雪的茶': 28,
      '乐乐茶': 22
    };

    let totalSaved = 0;
    monthlyRecords.forEach(record => {
      const marketPrice = marketPrices[record.brand] || 20;
      const actualPrice = parseFloat(record.price) || 0;
      if (actualPrice < marketPrice) {
        totalSaved += (marketPrice - actualPrice);
      }
    });
    
    this.setData({
      todayCount: todayRecords.length,
      todayCalories: todayRecords.reduce((sum, record) => sum + (parseInt(record.calories) || 0), 0),
      todayAmount,
      monthlySavings: totalSaved.toFixed(2),
      averagePrice: monthlyRecords.length ? 
        (monthlyRecords.reduce((sum, record) => sum + (parseFloat(record.price) || 0), 0) / monthlyRecords.length).toFixed(2) : 
        0
    });
  },
  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
    })
  }
}) 