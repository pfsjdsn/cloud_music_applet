
/**
 * 接口: 轮播图数据接口 /banner, 推荐歌单接口 /personalized, 排行榜数据接口
 * /top/list， 搜索初始提示接口 /search/default
 * 微信小程序官方api: 无
 * 微信小程序官方事件: wx.navigateTo  路由跳转
 * js: array.slice() 数组截取 array.forEach() 数据循环
 * async await 异步请求
 * promise封装请求
 */

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder内容
    navigationList: [{
      title: '每日推荐',
      iconName: 'icontuijian'
    },
    {
      title: '私人FM',
      iconName: 'icondiantai'
    },
    {
      title: '歌单',
      iconName: 'icongedan1'
    },
    {
      title: '排行榜',
      iconName: 'iconpaihangbang'
    },
    {
      title: '数字专辑',
      iconName: 'iconzhuanji-'
    }, {
      title: '聊唱',
      iconName: 'iconchangge'
    },
    {
      title: '游戏专区',
      iconName: 'iconiconfontyouxihudong'
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
    this.getInitData()
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
      this.data.topList.forEach(item => {
        item.tracks.forEach(e => {
          e['autor'] = e.ar[0].name
        });
      });
      this.setData({topList})
    }
  },
  // 获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
    })
  },
  // 导航区域跳转
  handleJump(e) {
    let {index, title} = e.currentTarget.dataset
    if (index == 0) {
      wx.navigateTo({
        url: '/songPackage/pages/recommendSong/index',
      })
    } else  {      
      wx.navigateTo({
        url: '/pages/songSquare/index?title=' + title,
      })
    }
  },
    // 轮播图跳转到歌曲详情
    toSongDetail(e) {
      let {id} = e.currentTarget.dataset
      wx.navigateTo({
        url: '../../songPackage/pages/songDetail/index?musicId=' + id,
      })
    },
    handInputFocus() {
      wx.navigateTo({
        url: '/pages/search/index',
      })
    },
    toMore(e){
      let {title} = e.currentTarget.dataset
      if (title === '推荐歌曲') {
        wx.navigateTo({
          url: '/pages/songSquare/index?title=' + '歌单广场',
        })
      } else {
        wx.navigateTo({
          url: '/pages/songSquare/index?title=' + '歌曲排行榜',
        })
      }
    },
    understandingMusic() {
      wx.navigateTo({
        url: '/pages/songSquare/index?title=' + '听歌识曲',
      })
    },
    toSongListDetails(e) {
      let {id} = e.currentTarget.dataset
      wx.navigateTo({
        url: '/pages/songListDetails/index?id=' + id,
      })
    },
})