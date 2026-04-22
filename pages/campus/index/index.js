Page({
  data: {
    modules: [
      {
        name: '表白墙',
        icon: '/image/v2/saylove.png',
        url: '/pages/home/index_2/index_2',
        desc: '大声说出你的爱'
      },
      {
        name: '卖舍友',
        icon: '/image/v2/sale.png',
        url: '/pages/sale/index_2/sale_2',
        desc: '单身舍友大放送'
      },
      {
        name: '步数旅行',
        icon: '/image/v2/run.png',
        url: '/pages/travel/index/index',
        desc: '走遍每一个角落'
      },
      {
        name: '情侣脸',
        icon: '/image/v2/fall-in-love.png',
        url: '/pages/compare_face/face',
        desc: '测试你们的缘分'
      }
    ]
  },

  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  }
});