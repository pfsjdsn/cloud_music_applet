/**
 * Math.round
 * 对象中添加元素
 * 
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
    console.log(options);
    this.getSongListDetails(options.id)

  },
  async getSongListDetails(id) {
    let res = await request('/playlist/detail', {id: id})
    console.log(res);
    let {coverObj, operationList, songList} = this.data
    coverObj.coverImgUrl = res.playlist.coverImgUrl
    coverObj.description = res.playlist.description
    coverObj.name = res.playlist.name
    coverObj.trackCount = res.playlist.trackCount
    coverObj.nickname = res.playlist.creator.nickname
    coverObj.avatarUrl = res.playlist.creator.avatarUrl
    coverObj.tags = res.playlist.tags
    songList = res.playlist.tracks
    console.log(res.playlist.playCount);
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
      console.log(item);
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
    console.log(this.data.songList);
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