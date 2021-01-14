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
    historyList: []
  },

  onLoad: function (options) {

    this.getInitData()
    this.getHistoryList()
  },
  // 获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hostListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hostList: hostListData.data
    })
    console.log(this.data.hostList);
    
  },
  getHistoryList() {
    let historyList = wx.getStorageSync('historyList')
    if (historyList) {
      this.setData({historyList})
    }
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
  async getSearchList(e) {
    console.log(e);
    if (e) {
      let {searchContent} = e.currentTarget.dataset
      this.setData({searchContent})
    }
    let {placeholderContent}  = this.data
    if (placeholderContent && !this.data.searchContent) {
      this.setData({
        searchContent: placeholderContent
      })
    }
    if(!this.data.searchContent) {
      // 如果输入内容为空，直接return 
      this.setData({
        searchList: []
      })
      return
    }
    let {searchContent, historyList} = this.data
    let searchListData = await request('/search', {keywords: searchContent, limit: 10})
      this.setData({
        searchList: searchListData.result.songs
    })
    console.log(this.data.searchList);
    
    // 记录去重
    if(historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({historyList})
    wx.setStorageSync('historyList', historyList)
  },
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  delSearchHistory() {
    wx.showModal({
      content: '确认删除吗?',
      success: (res) => {
        if (res.confirm) {
          this.setData({historyList: []})
          wx.removeStorageSync('historyList')
        }
      } 
    })
  },
  toSongDetail(e) {
    let {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '../../songPackage/pages/songDetail/index?musicId=' + id,
    })
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
})