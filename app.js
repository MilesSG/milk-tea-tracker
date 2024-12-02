App({
  globalData: {
    userInfo: null,
    teaRecords: [],
    monthlyGoal: wx.getStorageSync('monthlyGoal') || 20 // 默认目标20杯/月
  },

  onLaunch() {
    // 获取本地存储的奶茶记录
    const records = wx.getStorageSync('teaRecords') || []
    this.globalData.teaRecords = records
    // 初始化加载用户设置的目标
    const monthlyGoal = wx.getStorageSync('monthlyGoal');
    if (monthlyGoal) {
      this.globalData.monthlyGoal = monthlyGoal;
    }
  }
}); 