// pages/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthlyCount: 0,
    totalCalories: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.calculateStats()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  calculateStats() {
    const app = getApp()
    const records = app.globalData.teaRecords
    const now = new Date()
    const thisMonth = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === now.getMonth()
    })
    
    this.setData({
      monthlyCount: thisMonth.length,
      totalCalories: records.reduce((sum, record) => sum + (Number(record.calories) || 0), 0)
    })
  }
})