import request from '../../utils/request'
const app = getApp()

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

    // 判断当前页面是否在播放
    if(app.globalData.isMusicPlay && app.globalData.musicId == this.data.musicId) {
      // 修改当前页面播放状态为true
      this.setData({
        isPlay: true
      })
    }
    // 控制音乐播放的实例(添加到this中， 可全局调用)
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      app.globalData.musicId = this.data.musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
  },
  // 修改播放状态封装的函数
  changePlayState(isPlay) {
    // 修改音乐播放的状态
    this.setData({
      isPlay
    })
    // 修改全局音乐播放状态
    app.globalData.isMusicPlay = isPlay
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
    if (isPlay) {
      // 获取音乐链接
      let musicLinkData = await request('/song/url', {id: musicId})
      this.backgroundAudioManager.src = musicLinkData.data[0].url
      this.backgroundAudioManager.title = this.data.song.name
    } else  { // 暂停音乐
      this.backgroundAudioManager.pause()
    }
  },
  // 切换上一首或下一首歌
  handleSwitch() {

  },
})