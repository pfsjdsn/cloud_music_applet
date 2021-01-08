
/**
 * 消息页面通信
 * 1. 1. 绑定事件
      1. 事件名
      2. 事件的回调
      3. 订阅方: PubSub.subscribe(事件名，事件的回调)
      4. 订阅方式接受数据的一方
   2. 触发事件
      1. 事件名
      2. 提供事件参数对象， 等同于原生事件的event对象
      3. 发布方: PubSub.publish(事件名，提供的数据)
      4. 发布方是提供数据的一方
 * 
 */
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '',
    month: '',
    day: '',
    recommendList: [], // 推荐音乐列表
    index: 0, //点击歌曲的下标

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '../../../pages/login/index',
          })
        }
      })
    }
    this.setData({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    })
    this.getRecommendList()
    // 订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchTpye', (msg, type) => {
      let {recommendList, index} = this.data
      if (type == 'pre') { // 上一首
        // 如果是第一首，就跳转到最后一首
        (index == 0) && (index = recommendList.length)
        index -= 1 // 减1
      } else { // 下一首
        // 如果是最后一首，就跳转到第一首
        (index == recommendList.length -1) && (index = -1)
        index += 1
      }
      // 更新下标
      this.setData({
        index
      })
      let musicId = recommendList[index].id
      // 将musicId回传给songDetail页面
      PubSub.publish('musicId', musicId)
    })
  },
  async getRecommendList() {
    let recommendList = await request('/recommend/songs')
    this.setData({
      recommendList: recommendList.recommend
    })
  }, 
  // 跳转到歌曲详情
  toSongDetail(e) {
    console.log(e);
    let {song, index} = e.currentTarget.dataset
    this.setData({index})
    wx.navigateTo({
      url: '../songDetail/index?musicId=' + song.id,
    })
  },
})
