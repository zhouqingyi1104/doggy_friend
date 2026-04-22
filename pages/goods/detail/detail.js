const { http } = require('../../../utils/http.js');

Page({
  data: {
    goods: null,
    myId: null
  },

  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ myId: userInfo?.id ? String(userInfo.id) : null });

    if (options.id) {
      this.loadDetail(options.id);
    }
  },

  loadDetail(id) {
    http({
      url: `/goods/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({ goods: res.data });
    });
  },

  buyGoods() {
    wx.showModal({
      title: '确认购买',
      content: `购买将从钱包扣除 ${this.data.goods.price} 元，是否确认？`,
      success: (res) => {
        if (res.confirm) {
          http({
            url: `/goods/${this.data.goods.id}/buy`,
            method: 'POST',
            data: { quantity: 1 }
          }).then(() => {
            wx.showToast({ title: '购买成功！', icon: 'success' });
            this.loadDetail(this.data.goods.id);
          }).catch(err => {
            wx.showToast({ title: err.data?.message || '余额不足或库存不够', icon: 'none' });
          });
        }
      }
    });
  }
});