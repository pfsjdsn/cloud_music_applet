import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '',
    month: '',
    day: '',
    recommendList: [], // 推荐音乐列表

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
            url: '/pages/login/index',
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
  },
  async getRecommendList() {
    let recommendList = await request('/recommend/songs')
    this.setData({
      recommendList: recommendList.recommend
    })
  }, 
})
