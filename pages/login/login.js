Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(e) {    
    let {type} = e.currentTarget.dataset
    this.setData({
      [type]: e.detail.value //变量， 自动赋值
    })
  },
  login(){
    let {phone , password} = this.data
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'none'
      })
      return
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/ // 一位两位第三位是数字，然后是9个数字
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误！',
        icon: 'none'
      })
      return
    }
    if(!password) {
      wx.showToast({
        title: '密码不能为空！',
        icon: 'none'
      })
      return
    }
  }
})