// pages/songSquare/index.js
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
     // 动态设置当前页面标题
     wx.setNavigationBarTitle({
      title: options.title
    })
  },
})