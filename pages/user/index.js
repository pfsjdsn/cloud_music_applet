

/* 接口: 最近播放记录接口 /user/record
* 微信小程序官方api: 无
* 微信小程序官方事件: wx.navigateTo  路由跳转
* async await 异步请求
 * 手指移动
 * transform:变形。改变
 * translate:移动，transform的一个方法
 * transition: 平滑的过渡
* promise封装请求
*/
let startY = 0; //手指起始坐标
let moveY = 0 //手指移动坐标
let moveDistance = 0 // //手指移动的距离

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalNavList: [{
      title: '我的消息',
      iconName: 'iconwodexiaoxi'
    }, {
      title: '我的好友',
      iconName: 'iconwodehaoyou'
    }, {
      title: '个人主页',
      iconName: 'iconzhuye-copy'
    }, {
      title: '个性装扮',
      iconName: 'icongexingzhuangban'
    }],
    moduleList: [{title: '我的音乐'},{title: '我的收藏'},{title: '我的电台'}],
    converTransform: 'translateY(0rpx)',
    coverTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: [] // 播放记录
  },
  onLoad: function (options) {

  },
  onShow() {
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
    this.getrecentPlayList(userInfo.userId)
  },
  async getrecentPlayList(uid) {
    
    let recentPlayListData = await request('/user/record', {uid, type: 1})
    let index = 0
    
    let recentPlayList = recentPlayListData.weekData.slice(0,9).map(item => { // 截取前10条记录,再增加一个id字段
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList
    })
    console.log(this.data.recentPlayList);
    
  },
  // 点击
  handleTouchStart(e) {
    startY = e.touches[0].clientY
    this.setData({
      coverTransition: ''
    })
  },
  // 移动
  handleTouchMove(e) {
    moveY = e.touches[0].clientY
    moveDistance = moveY - startY
    if(moveDistance <= 0) {
      return
    }
    if(moveDistance >= 80) {
      moveDistance = 80
    }
    this.setData({
      converTransform: `translateY(${moveDistance}rpx)`
    })
  },
  // 松开
  bindtouchEnd(e) {
    this.setData({
      converTransform: 'translateY(0rpx)',
      coverTransition: 'transform 1s linear'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
    
  },
  toPersonal(e) {
    let {title} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/songSquare/index?title=' + title
    })
  },
  openMembership() {
    wx.navigateTo({
      url: '/pages/songSquare/index?title=' + '会员中心'
    })
  },
  toSongDetail(e) {
    let {id} = e.currentTarget.dataset
    
    wx.navigateTo({
      url: '../../songPackage/pages/songDetail/index?musicId=' + id,
    })
  },
})