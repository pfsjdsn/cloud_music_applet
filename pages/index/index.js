import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationList: [{
        title: '每日推荐',
        iconName: 'icontuijian'
      },
      {
        title: '歌单',
        iconName: 'icongedan'
      },
      {
        title: '排行榜',
        iconName: 'iconpaihangbang'
      },
      {
        title: '电台',
        iconName: 'icondiantai'
      }, {
        title: '直播',
        iconName: 'iconzhibobofangshexiangjiguankanmianxing'
      }
    ],
    banners: [], // 轮播图数据
    recommendList: [], //推荐歌单

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    // 获取轮播图数据
    let {banners} = await request('/banner', {type: 2})
    this.setData({banners})

    // 获取推荐歌单数据
    let res = await request('/personalized', {limit: 10})
    this.setData({recommendList: res.result})
  }
})