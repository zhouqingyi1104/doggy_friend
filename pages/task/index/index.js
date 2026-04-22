import { http } from '../../../utils/http.js';
const app = getApp();

Page({
  data: {
    tasks: [],
    page: 1,
    canLoadMore: true,
  },

  onLoad() {
    this.loadTasks(true);
  },

  onPullDownRefresh() {
    this.loadTasks(true);
  },

  onReachBottom() {
    this.loadTasks(false);
  },

  loadTasks(isRefresh) {
    if (!this.data.canLoadMore && !isRefresh) return;
    
    let page = isRefresh ? 1 : this.data.page + 1;

    http({
      url: '/task/list',
      method: 'GET',
      data: {
        page: page,
        page_size: 10
      }
    }).then(res => {
      wx.stopPullDownRefresh();
      let newData = res.data.page_data || [];
      this.setData({
        tasks: isRefresh ? newData : this.data.tasks.concat(newData),
        page: page,
        canLoadMore: newData.length >= 10
      });
    });
  },

  goPost() {
    wx.navigateTo({
      url: '/pages/task/post/post'
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/task/detail/detail?id=' + id
    });
  }
});