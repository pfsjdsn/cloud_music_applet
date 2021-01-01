import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },
  async getVideoGroupList() {
    let videoGroupList = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupList.data.slice(0, 14), //取前15条数据 
      navId: videoGroupList.data[0].id
    })
    this.getVideoList(this.data.navId)    
  },
  changeNav(e) {
    let navId = e.currentTarget.dataset.id
    // navId>>>0 右移 0 位 会将非number 转换成number 类型
    this.setData({
      navId: navId
    })
  },
  async getVideoList(id) {
    let videoListData = await request('/video/group', {id})
    let index = 0
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList
    })
    console.log(this.data.videoList);
    
  }
})