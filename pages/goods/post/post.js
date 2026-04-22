const { http } = require('../../../utils/http.js');

Page({
  data: {
    title: '',
    description: '',
    category: '其他',
    price: '',
    stock: '1',

    categories: ['数码电子', '书籍教材', '生活用品', '其他闲置'],
    catIndex: 3,
  },

  bindCatChange(e) {
    this.setData({
      catIndex: e.detail.value,
      category: this.data.categories[e.detail.value]
    });
  },

  inputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  submitGoods() {
    const { title, description, price, stock, category } = this.data;
    
    if (!title || !description || !price || !stock) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '安全校验中...' });

    http({
      url: '/utils/check_text',
      method: 'POST',
      data: { content: title + ' ' + description }
    }).then(res => {
      this.doPublish();
    }).catch(err => {
      wx.hideLoading();
      wx.showModal({
        title: '内容违规',
        content: err.data?.message || '内容包含违禁词（如教育类词汇）。',
        showCancel: false
      });
    });
  },

  doPublish() {
    http({
      url: '/goods/publish',
      method: 'POST',
      data: {
        title: this.data.title,
        description: this.data.description,
        category: this.data.category,
        price: parseFloat(this.data.price),
        stock: parseInt(this.data.stock)
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '发布失败', icon: 'none' });
    });
  }
});