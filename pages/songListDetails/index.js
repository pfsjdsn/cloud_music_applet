import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operationList: [{
      number: 11869,
      iconName: 'icontianjiazengjiajia'
    }, {
      number: 11869,
      iconName: 'iconpinglun1'
    }, {
      number: 11869,
      iconName: 'iconshare_icon'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getSongListDetails(options.id)

  },
  async getSongListDetails(id) {
    let res = await request('/playlist/detail', {
      id: id
    })
    console.log(res);

  }
})