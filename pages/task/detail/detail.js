import { http } from '../../../utils/http.js';

Page({
  data: {
    task: null,
    myId: null
  },

  onLoad(options) {
    // We should ideally fetch myId from storage/auth service
    // For now we get it when loading the detail to see if I am buyer/seller
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ myId: userInfo?.id ? String(userInfo.id) : null });

    if (options.id) {
      this.loadDetail(options.id);
    }
  },

  loadDetail(id) {
    http({
      url: `/task/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({ task: res.data });
    });
  },

  acceptTask() {
    wx.showModal({
      title: '确认接单',
      content: `接单将冻结您钱包中的 ${this.data.task.deposit} 元担保金，是否确认？`,
      success: (res) => {
        if (res.confirm) {
          http({
            url: `/task/${this.data.task.id}/accept`,
            method: 'POST'
          }).then(() => {
            wx.showToast({ title: '接单成功', icon: 'success' });
            this.loadDetail(this.data.task.id);
          }).catch(err => {
            wx.showToast({ title: err.data?.message || '余额不足或失败', icon: 'none' });
          });
        }
      }
    });
  },

  completeTask() {
    wx.showModal({
      title: '确认完成',
      content: `任务完成后，买家悬赏金额和您的担保金将转入您的钱包余额。`,
      success: (res) => {
        if (res.confirm) {
          http({
            url: `/task/${this.data.task.id}/complete`,
            method: 'POST'
          }).then(() => {
            wx.showToast({ title: '已标记完成', icon: 'success' });
            this.loadDetail(this.data.task.id);
          });
        }
      }
    });
  },

  cancelTask() {
    wx.showModal({
      title: '取消任务',
      content: `进行中取消将扣除部分担保金/金额，是否继续？`,
      success: (res) => {
        if (res.confirm) {
          http({
            url: `/task/${this.data.task.id}/cancel`,
            method: 'POST',
            data: { reason: '用户主动取消' }
          }).then(() => {
            wx.showToast({ title: '任务已取消', icon: 'success' });
            this.loadDetail(this.data.task.id);
          });
        }
      }
    });
  }
});