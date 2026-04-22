const { http } = require('../../../utils/http.js');
const app = getApp();

Page({
  data: {
    wallet: null
  },

  onLoad() {
    this.loadWallet();
  },

  onShow() {
    this.loadWallet();
  },

  loadWallet() {
    http({
      url: '/wallet/info',
      method: 'GET'
    }).then(res => {
      this.setData({ wallet: res.data });
    });
  },

  recharge() {
    wx.showModal({
      title: '模拟充值',
      content: '请输入充值金额',
      editable: true,
      placeholderText: '金额',
      success: (res) => {
        if (res.confirm && res.content) {
          const amount = parseFloat(res.content);
          if (isNaN(amount) || amount <= 0) return;
          
          http({
            url: '/wallet/recharge',
            method: 'POST',
            data: { amount }
          }).then(() => {
            wx.showToast({ title: '充值成功', icon: 'success' });
            this.loadWallet();
          });
        }
      }
    });
  },

  withdraw() {
    wx.showModal({
      title: '模拟提现',
      content: '请输入提现金额',
      editable: true,
      placeholderText: '金额',
      success: (res) => {
        if (res.confirm && res.content) {
          const amount = parseFloat(res.content);
          if (isNaN(amount) || amount <= 0) return;
          
          http({
            url: '/wallet/withdraw',
            method: 'POST',
            data: { amount }
          }).then(() => {
            wx.showToast({ title: '提现申请已提交', icon: 'success' });
            this.loadWallet();
          }).catch(err => {
            wx.showToast({ title: err.data?.message || '余额不足', icon: 'none' });
          });
        }
      }
    });
  }
});