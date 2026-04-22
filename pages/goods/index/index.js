const { http } = require('../../../utils/http.js');
const app = getApp();

Page({
  data: {
    goodsList: [],
    page: 1,
    canLoadMore: true,
  },

  onLoad() {
    this.loadGoods(true);
  },

  onPullDownRefresh() {
    this.loadGoods(true);
  },

  onReachBottom() {
    this.loadGoods(false);
  },

  loadGoods(isRefresh) {
    if (!this.data.canLoadMore && !isRefresh) return;
    
    let page = isRefresh ? 1 : this.data.page + 1;

    http({
      url: '/goods/list',
      method: 'GET',
      data: {
        page: page,
        page_size: 10
      }
    }).then(res => {
      wx.stopPullDownRefresh();
      let newData = res.data.page_data || [];
      this.setData({
        goodsList: isRefresh ? newData : this.data.goodsList.concat(newData),
        page: page,
        canLoadMore: newData.length >= 10
      });
    });
  },

  goPost() {
    wx.navigateTo({
      url: '/pages/goods/post/post'
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id
    });
  }
});