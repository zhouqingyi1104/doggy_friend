import { http } from '../../../utils/http.js';
const app = getApp();

Page({
  data: {
    title: '',
    type: 1, // 1-代购, 2-搬运, 3-其他
    description: '',
    location: '',
    time_range: '',
    price: '',
    deposit: '',
    min_credit: 100,

    types: ['代购跑腿', '搬运服务', '其他互助'],
    typeIndex: 0,
  },

  bindTypeChange(e) {
    this.setData({
      typeIndex: e.detail.value,
      type: parseInt(e.detail.value) + 1
    });
  },

  inputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  submitTask() {
    const { title, type, description, price, min_credit } = this.data;
    
    if (!title || !description || !price) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在校验发布...' });

    http({
      url: '/utils/check_text',
      method: 'POST',
      data: { content: title + ' ' + description }
    }).then(res => {
      // 校验通过后发布
      this.doCreate();
    }).catch(err => {
      wx.hideLoading();
      wx.showModal({
        title: '内容违规提示',
        content: err.data?.message || '内容包含违禁词（如教育类词汇），请修改为时间互助或技能服务。',
        showCancel: false
      });
    });
  },

  doCreate() {
    http({
      url: '/task/create',
      method: 'POST',
      data: {
        title: this.data.title,
        type: this.data.type,
        description: this.data.description,
        location: this.data.location,
        time_range: this.data.time_range,
        price: parseFloat(this.data.price),
        deposit: parseFloat(this.data.deposit || 0),
        min_credit: parseInt(this.data.min_credit)
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: err.data?.message || '余额不足或发布失败', icon: 'none' });
    });
  }
});