App({
  globalData: {
    userInfo: null,
    teaRecords: []
  },
  onLaunch() {
    // 获取本地存储的奶茶记录
    const records = wx.getStorageSync('teaRecords') || []
    this.globalData.teaRecords = records
  }
}) 