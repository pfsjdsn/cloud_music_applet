import request from '../../utils/request'

let isSend = false // 节流函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder内容
    hostList: [], // 热搜榜数据
    searchContent: '', // 用户输入的内容
    searchList: [], // 关键字模糊匹配的数据
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
   handleInputChange(e) {
    this.setData({
      searchContent: e.detail.value.trim()
    })
    if(isSend) {
      return
    }
    isSend = true
    this.getSearchList()
    // 节流函数(只会执行一次)
    setTimeout(() => {
    isSend = false
    }, 3000);
  },
  async getSearchList() {
    if(!this.data.searchContent) {
      // 如果输入内容为空，直接return 
      this.setData({
        searchList: []
      })
      return
    }
    let searchListData = await request('/search', {keywords: this.data.searchContent, limit: 10})
      this.setData({
        searchList: searchListData.result.songs
    })
  }

})