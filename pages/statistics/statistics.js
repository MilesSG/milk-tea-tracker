// pages/statistics/statistics.js
const wxCharts = require('../../utils/wxcharts.js');

Page({
  data: {
    completionRate: 0,
    monthlyGoal: 5,
    currentCount: 0,
    showGoalSetting: false,
    goalRange: Array.from({length: 31}, (_, i) => i + 1), // 1-31杯
    goalPickerValue: [4], // 默认选中第5个（索引从0开始）
  },

  onLoad: function() {
    this.loadData();
    // 初始化picker的选中值
    const currentGoal = wx.getStorageSync('monthlyGoal') || 5;
    this.setData({
      goalPickerValue: [currentGoal - 1]
    });
  },

  onShow: function() {
    this.loadData();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  },

  loadData: function() {
    // 获取本月记录
    const records = wx.getStorageSync('teaRecords') || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear;
    });
    
    const currentCount = monthlyRecords.length;
    const monthlyGoal = wx.getStorageSync('monthlyGoal') || 5;
    const completionRate = Math.min(Math.round((currentCount / monthlyGoal) * 100), 100);

    this.setData({
      completionRate,
      monthlyGoal,
      currentCount
    });

    this.drawProgressCircle();
    this.drawLineChart(records);
  },

  drawProgressCircle: function() {
    const query = wx.createSelectorQuery();
    query.select('#progressCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const centerX = res[0].width / 2;
        const centerY = res[0].height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // 绘制背景圆环
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFE4E1';
        ctx.lineWidth = 15;
        ctx.stroke();
        
        // 绘制进度圆环
        const progress = this.data.completionRate / 100;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * progress));
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 15;
        ctx.stroke();
      });
  },

  drawLineChart: function(records) {
    const query = wx.createSelectorQuery();
    query.select('#lineChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const width = res[0].width;
        const height = res[0].height;
        const padding = 40;

        // 获取最近7天的数据
        const days = 7;
        const dateLabels = [];
        const drinkCounts = new Array(days).fill(0);
        
        // 生成最近7天的日期标签
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dateLabels.push(`${date.getMonth() + 1}/${date.getDate()}`);
        }

        // 统计每天的饮品数量
        records.forEach(record => {
          const recordDate = new Date(record.date);
          const today = new Date();
          const diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
          if (diffDays < days) {
            drinkCounts[days - 1 - diffDays]++;
          }
        });

        const xStep = (width - padding * 2) / (days - 1);
        const maxCount = Math.max(...drinkCounts, 5);
        const yStep = (height - padding * 2) / maxCount;

        // 绘制坐标轴
        ctx.beginPath();
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // 绘制折线
        ctx.beginPath();
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        drinkCounts.forEach((count, index) => {
          const x = padding + index * xStep;
          const y = height - padding - count * yStep;
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();

        // 绘制数据点
        drinkCounts.forEach((count, index) => {
          const x = padding + index * xStep;
          const y = height - padding - count * yStep;
          ctx.beginPath();
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#FF69B4';
          ctx.lineWidth = 2;
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });

        // 绘制X轴标签
        ctx.fillStyle = '#999999';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        dateLabels.forEach((label, index) => {
          const x = padding + index * xStep;
          ctx.fillText(label, x, height - padding + 20);
        });

        // 绘制Y轴标签
        ctx.textAlign = 'right';
        for (let i = 0; i <= maxCount; i++) {
          const y = height - padding - i * yStep;
          ctx.fillText(i.toString(), padding - 10, y + 4);
        }
      });
  },

  showGoalSetting: function() {
    this.setData({
      showGoalSetting: true
    });
  },

  hideGoalSetting: function() {
    this.setData({
      showGoalSetting: false
    });
  },

  onGoalChange: function(e) {
    const val = e.detail.value;
    this.setData({
      goalPickerValue: val
    });
  },

  saveGoal: function() {
    const newGoal = this.data.goalRange[this.data.goalPickerValue[0]];
    wx.setStorageSync('monthlyGoal', newGoal);
    this.setData({
      monthlyGoal: newGoal,
      showGoalSetting: false
    });
    
    // 重新计算完成率并更新UI
    this.loadData();

    wx.showToast({
      title: '目标已更新',
      icon: 'success',
      duration: 2000
    });
  }
});