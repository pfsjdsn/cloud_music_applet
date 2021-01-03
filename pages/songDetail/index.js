import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否在播放
    song: {}, //音乐详情
    musicId: '', //音乐id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      musicId: options.musicId
    })
    this.getMusicInfo(this.data.musicId)

  },
  //点击播放
  handleMusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay
    })
    this.musicConrol(this.data.isPlay,this.data.musicId)

  },
  // 获取音乐详情
  async getMusicInfo(musicId) {
    let res = await request('/song/detail',{ids: musicId})
    this.setData({
      song: res.songs[0]
    })
    // 动态设置当前页面标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 控制音乐播放/暂停
  async musicConrol(isPlay, musicId){
    // 控制音乐播放的实例
    let backgroundAudioManager = wx.getBackgroundAudioManager()
    if (isPlay) {
      // 获取音乐链接
      let musicLinkData = await request('/song/url', {id: musicId})
      backgroundAudioManager.src = musicLinkData.data[0].url
      backgroundAudioManager.title = this.data.song.name
    } else  { // 暂停音乐
      backgroundAudioManager.pause()
    }
  }
})