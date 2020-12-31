/**
 * 
 * 手指移动
 * transform:变形。改变
 * translate:移动，transform的一个方法
 * transition: 平滑的过渡
 */
let startY = 0; //手指起始坐标
let moveY = 0 //手指移动坐标
let moveDistance = 0 // //手指移动的距离
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
    coverTransition: ''
  },
  onLoad: function (options) {

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
})