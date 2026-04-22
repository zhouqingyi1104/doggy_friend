const { http } = require('../../../utils/http.js');
const util = require('../../../utils/util.js');

Page({
  data: {
    currentTab: 0, // 0: published, 1: accepted
    tasks: [],
    pageNumber: 1,
    pageSize: 10,
    canLoadMore: true,
  },

  onLoad() {
    this.loadData(true);
  },

  onShow() {
    this.loadData(true);
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (this.data.currentTab === index) return;
    
    this.setData({
      currentTab: index,
    });
    this.loadData(true);
  },

  onPullDownRefresh() {
    this.loadData(true);
  },

  onReachBottom() {
    this.loadData(false);
  },

  loadData(isRefresh) {
    if (!this.data.canLoadMore && !isRefresh) return;
    
    const page = isRefresh ? 1 : this.data.pageNumber + 1;
    const url = this.data.currentTab === 0 ? '/task/my_published' : '/task/my_accepted';

    wx.showNavigationBarLoading();
    http({
      url: url,
      method: 'GET',
      data: {
        page_number: page,
        page_size: this.data.pageSize
      }
    }).then(res => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      
      let newData = res.data.page_data || [];
      // Format dates
      newData = newData.map(item => {
        if (item.created_at) {
           item.created_at = util.formatTime(new Date(item.created_at));
        }
        return item;
      });

      this.setData({
        tasks: isRefresh ? newData : this.data.tasks.concat(newData),
        pageNumber: page,
        canLoadMore: newData.length >= this.data.pageSize
      });
    }).catch(err => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/task/detail/detail?id=${id}`
    });
  }
});