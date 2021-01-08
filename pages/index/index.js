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
    topList: [], //排行榜数据

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

    // 获取排行榜数据
    let idx = 0
    let {topList} = this.data
    // 取5份
    while (idx < 5) {
      let res = await request('/top/list', {idx: idx++})
      // 取前3条
      let topListItem = {name: res.playlist.name, tracks: res.playlist.tracks.slice(0, 3)}
      topList.push(topListItem)
      this.setData({topList})
    }
  },
  // 导航区域跳转
  handleJump(e) {
    let {index} = e.currentTarget.dataset
    if (index == 0) {
      wx.navigateTo({
        url: '/songPackage/pages/recommendSong/index',
      })
    }
  }
})