const { brandLogos } = require('../../utils/brandLogos.js');

Page({
  data: {
    currentDate: '',
    showForm: false,
    formData: {},
    todayRecords: [],
    todayCalories: 0,
    frequentDrinks: [
      {
        id: 1,
        name: '生椰拿铁',
        brand: '瑞幸咖啡',
        calories: 180,
        icon: brandLogos.luckin
      },
      {
        id: 2,
        name: '星冰乐',
        brand: '星巴克',
        calories: 320,
        icon: brandLogos.starbucks
      },
      {
        id: 3,
        name: '霸气烤奶',
        brand: '霸王茶姬',
        calories: 280,
        icon: brandLogos.bawang
      },
      {
        id: 4,
        name: '蜜雪冰城',
        brand: '蜜雪冰城',
        calories: 250,
        icon: brandLogos.mixue
      },
      {
        id: 5,
        name: '喜茶满杯',
        brand: '喜茶',
        calories: 300,
        icon: brandLogos.heytea
      },
      {
        id: 6,
        name: '奈雪的茶',
        brand: '奈雪的茶',
        calories: 290,
        icon: brandLogos.nayuki
      },
      {
        id: 7,
        name: '乐乐茶',
        brand: '乐乐茶',
        calories: 310,
        icon: brandLogos.lele
      }
    ]
  },

  onLoad: function() {
    this.setCurrentDate();
    this.loadTodayRecords();
  },

  onShow: function() {
    this.loadTodayRecords();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
  },

  setCurrentDate: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    this.setData({
      currentDate: `${year}年${month}月${date}日`
    });
  },

  loadTodayRecords: function() {
    const records = wx.getStorageSync('teaRecords') || [];
    const today = new Date().toDateString();
    const todayRecords = records.filter(record => {
      return new Date(record.date).toDateString() === today;
    }).map(record => ({
      ...record,
      timeStr: new Date(record.date).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    const todayCalories = todayRecords.reduce((sum, record) => {
      const calories = parseInt(record.calories) || 0;
      return sum + calories;
    }, 0);

    this.setData({
      todayRecords,
      todayCalories
    });
  },

  quickAdd: function(e) {
    const drink = e.currentTarget.dataset.drink;
    const record = {
      ...drink,
      calories: parseInt(drink.calories) || 0,
      date: new Date().toISOString()
    };
    this.saveRecord(record);
  },

  showCustomForm: function() {
    this.setData({
      showForm: true,
      formData: {}
    });
  },

  hideCustomForm: function() {
    this.setData({
      showForm: false
    });
  },

  submitRecord: function(e) {
    const formData = e.detail.value;
    formData.calories = parseInt(formData.calories) || 0;
    formData.date = new Date().toISOString();
    this.saveRecord(formData);
  },

  saveRecord: function(record) {
    const records = wx.getStorageSync('teaRecords') || [];
    records.unshift(record);
    wx.setStorageSync('teaRecords', records);
    
    this.hideCustomForm();
    this.loadTodayRecords();
    
    wx.showToast({
      title: '记录成功 (｡♥‿♥｡)',
      icon: 'success'
    });
  },

  editRecord: function(e) {
    const id = e.currentTarget.dataset.id;
    const record = this.data.todayRecords.find(r => r.id === id);
    this.setData({
      showForm: true,
      formData: record
    });
  },

  deleteRecord: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const records = wx.getStorageSync('teaRecords') || [];
          const newRecords = records.filter(r => r.id !== id);
          wx.setStorageSync('teaRecords', newRecords);
          this.loadTodayRecords();
        }
      }
    });
  }
}); 