/**
 * 消息页面通信
 * 1. 1. 绑定事件
      1. 事件名
      2. 事件的回调
      3. 订阅方: PubSub.subscribe(事件名，事件的回调)
      4. 订阅方式接受数据的一方
   2. 触发事件
      1. 事件名
      2. 提供事件参数对象， 等同于原生事件的event对象
      3. 发布方: PubSub.publish(事件名，提供的数据)
      4. 发布方是提供数据的一方
 * js库： momentjs日期处理类库
 */
import request from '../../utils/request'
import moment from 'moment'

import PubSub from 'pubsub-js' 
const app = getApp()

Page({
  data: {
    isPlay: false, // 音乐是否在播放
    song: {}, //音乐详情
    musicId: '', //音乐id
    musicLink: '', // 音乐链接
    currentTime: '00:00', // 播放实时时间
    durationTime: '00:00', // 播放总时长
    currentWidth: 200, // 实时进度条的宽度
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
    // 音乐自然结束
    this.backgroundAudioManager.onEnded(() => {
      // 切换下一首并自动播放
      PubSub.publish('switchTpye', 'next')
      // 进度条宽度重置为0,时间还原为0
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })

    })
    // 监听实时播放的进度
    this.backgroundAudioManager.onTimeUpdate( () => {
      console.log('总时长',  this.backgroundAudioManager.duration)
      console.log('实时时长',  this.backgroundAudioManager.currentTime) // s
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      // 当前时间  当前进度条宽度
      // ——————— = ————————————  
      // 总时间      进度条总宽度
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth  
      })
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
    let isPlay = !this.data.isPlay
    let {musicId, musicLink}  = this.data
    this.musicConrol(isPlay, musicId, musicLink)

  },
  // 获取音乐详情
  async getMusicInfo(musicId) {
    let res = await request('/song/detail',{ids: musicId})
    let durationTime = moment(res.songs[0].dt).format('mm:ss')
    console.log(durationTime);
    this.setData({
      song: res.songs[0],
      durationTime
    })
    // 动态设置当前页面标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 控制音乐播放/暂停
  async musicConrol(isPlay, musicId, musicLink){
    if (isPlay) {
      if (!musicLink) { // 避免重复发获取音乐链接的请求
        // 获取音乐链接
        let musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url 
        this.setData({musicLink})
      }
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else  { // 暂停音乐
      this.backgroundAudioManager.pause()
    }
  },
  // 切换上一首或下一首歌
  handleSwitch(e) {
    let {type} = e.currentTarget.dataset
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop()
    // 订阅来自recommendSong页面发布的musicId的消息(onload页面中，只会执行一次 )
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId);
      // 获取音乐信息
      this.getMusicInfo(musicId)
      // 自动播放
      this.musicConrol(true, musicId)
      // 取消订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchTpye', type)
  },
})