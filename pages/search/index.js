import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder内容
    hostList: [], // 热搜榜数据
  },

  onLoad: function (options) {

    this.getInitData()
  },
  // 获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hostListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hostList: hostListData.data
    })
  },
})