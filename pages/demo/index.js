// pages/demo/index.js
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

  },
  chooseLocation: function () {
    const that = this
    wx.chooseLocation({
      success: function (res) {
          console.log(res)
      }
    })
 },
})