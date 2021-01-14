import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSongListDetails(options.id)
  },
  async getSongListDetails(id) {
    let res1 = await request('/playlist/detail', {id: id})
    console.log(res1)
  }
})