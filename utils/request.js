// 发送ajax请求
// new Promise初始化

import config from './config'
export default (url, data={}, method='GET') => {
  return new Promise ((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie:  wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') != -1) : '' // cookies是一个数组，取 MUSCI 就可以了
      },
      success: (res) => {
        
        if(data.isLogin == true) { // 如果是登录请求，把cookies存起来
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}