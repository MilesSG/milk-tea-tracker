Page({
  data: {},
  
  submitRecord(e) {
    const formData = e.detail.value
    formData.date = new Date().toISOString()
    
    const app = getApp()
    const records = app.globalData.teaRecords
    records.unshift(formData)
    
    wx.setStorageSync('teaRecords', records)
    
    wx.showToast({
      title: '记录成功 (｡♥‿♥｡)',
      icon: 'success',
      duration: 2000
    })
    
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }, 2000)
  }
}) 