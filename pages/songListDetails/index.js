/**
 * Math.round
 * 对象中添加元素
 * 
 */

 /**
 * 接口: 歌曲详情接口 /playlist/detail
 * 微信小程序官方api: 无
 * 微信小程序官方事件: wx.navigateTo  路由跳转
 * js: Math.round 四舍五入函数， toFixed(1) 四舍五入为指定小数位数的数字
 * async await 异步请求
 * promise封装请求
 */

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operationList: [{
      number: 11869,
      iconName: 'icontianjiazengjiajia'
    }, {
      number: 11869,
      iconName: 'iconpinglun1'
    }, {
      number: 11869,
      iconName: 'iconshare_icon'
    }],
    songListDetailsList: [],
    coverObj: {},
    songList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSongListDetails(options.id)

  },
  async getSongListDetails(id) {
    let res = await request('/playlist/detail', {id: id})
    let {coverObj, operationList, songList} = this.data
    coverObj.coverImgUrl = res.playlist.coverImgUrl
    coverObj.description = res.playlist.description
    coverObj.name = res.playlist.name
    coverObj.trackCount = res.playlist.trackCount
    coverObj.nickname =- res.playlist.creator.nickname
    coverObj.avatarUrl = res.playlist.creator.avatarUrl
    coverObj.tags = res.playlist.tags
    songList = res.playlist.tracks
    if (res.playlist.playCount > 100000000) {
      res.playlist.playCount = (res.playlist.playCount / 100000000).toFixed(1) + '亿'
    }
    if (res.playlist.subscribedCount > 100000000) {
      res.playlist.subscribedCount = (res.playlist.subscribedCount / 100000000).toFixed(1) + '亿'
    }
    if (res.playlist.commentCount > 100000000) {
      res.playlist.commentCount = (res.playlist.commentCount / 100000000).toFixed(1) + '亿'
    }
    if (res.playlist.shareCount > 100000000) {
      res.playlist.shareCount = (res.playlist.shareCount / 100000000).toFixed(1) + '亿'
    }
    if (res.playlist.playCount > 10000) {
      res.playlist.playCount = Math.round(res.playlist.playCount / 10000).toFixed(1)+ '万'
    }
    if (res.playlist.subscribedCount > 10000) {
      res.playlist.subscribedCount = Math.round(res.playlist.subscribedCount / 10000).toFixed(1) + '万'
    }
    if (res.playlist.commentCount > 10000) {
      res.playlist.commentCount = Math.round(res.playlist.commentCount / 10000).toFixed(1) + '万'
    }
    if (res.playlist.shareCount > 10000) {
      res.playlist.shareCount = Math.round(res.playlist.shareCount / 10000).toFixed(1) + '万'
    }
    coverObj.playCount =  res.playlist.playCount
    coverObj.subscribedCount = res.playlist.subscribedCount
    coverObj.commentCount = res.playlist.commentCount
    coverObj.shareCount = res.playlist.shareCount
    this.setData({
      coverObj,
      songList
    })
    operationList.forEach((item, index) => {
      if (index == 0) {
        item['number'] = coverObj.subscribedCount
      } else if (index == 1) {
        item['number'] = coverObj.commentCount
      } else {
        item['number'] = coverObj.shareCount
      }
    });
    this.setData({
      operationList
    })
  },
  toSongDetail(e) {
    let {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '../../songPackage/pages/songDetail/index?musicId=' + id,
    })
  },
  openMembership() {
    wx.navigateTo({
      url: '/pages/songSquare/index?title=' + '会员中心'
    })
  },
  toMore() {
    wx.navigateTo({
      url: '/pages/songSquare/index?title=' + this.data.coverObj.name
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  }
})