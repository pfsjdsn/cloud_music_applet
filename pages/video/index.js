/**
 * 网易云api无分页功能
 * 
 */
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 视频导航列表
    navId: '', // 当前所选导航对应的列表id
    videoList: [], // 视频列表
    videoId: '',
    videoUpdateTime: [], // 记录video播放的时长
    isTriggered: false, // 是否下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },
  // 获取视频导航列表
  async getVideoGroupList() {
    let videoGroupList = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupList.data.slice(0, 14), //取前15条数据 
      navId: videoGroupList.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
  // 点击导航切换
  changeNav(e) {
    let navId = e.currentTarget.dataset.id
    // navId>>>0 右移 0 位 会将非number 转换成number 类型
    this.setData({
      navId: navId,
      videoList: [] //在切换的时候重置以前的数据
    })
    wx.showLoading({
      title: '正在加载中...',
    })
    // 动态获取当前导航对应的视频
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表
  async getVideoList(id) {
    let videoListData = await request('/video/group', {
      id
    })
    // 关闭加载提示框
    wx.hideLoading()
    let index = 0
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false
    })

  },
  // 点击播放视频(一次只能播放一个视频，点击播放一个视频的时，关闭上一个正在播放的视频)
  handlePlay(e) {
    let vid = e.currentTarget.dataset.vid
    // 关闭上一个播放的视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // 此写法与上述效果一致
    // if( this.vid !== vid) {
    //   if(this.videoContext) {
    //     this.videoContext.stop()
    //   }
    // }
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    // 创建video的实例对象
    this.videoContext = wx.createVideoContext(vid)
    let {
      videoUpdateTime
    } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid == vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },
  // 视频播放时间进度
  handleTimeUpdate(e) {
    let videoTimeObj = {
      vid: e.currentTarget.dataset.vid,
      currentTime: e.detail.currentTime
    } // 当前播放id,当前播放时间
    let {
      videoUpdateTime
    } = this.data
    /**
     * 判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
     * 如果有， 在原有的播放记录中修改时间为当前的播放时间
     * 如果无， 需要在数组中添加当前视频的播放对象
     * 
     */
    let videoItem = videoUpdateTime.find(item => item.vid == videoTimeObj.vid)

    if (videoItem) { // 之前有,当前的播放时间赋给它
      videoItem.currentTime = e.detail.currentTime
    } else { // 如果没有， 添加当前视频的播放对象
      videoUpdateTime.push(videoTimeObj)
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },
  // 监听视频播放结束
  handleEnded(e) {
    // 移除记录播放时长数组中当前视频的对象
    let {
      videoUpdateTime
    } = this.data
    let idx = videoUpdateTime.findIndex(item => item.vid == e.currentTarget.dataset.vid)
    videoUpdateTime.splice(idx, 1)
    this.setData({
      videoUpdateTime
    })
  },
  // 下拉刷新 (scroll-view )
  handleRefresher() {
    this.getVideoList(this.data.navId)
  },
  // 上拉触底 (scroll-view ) 
  handleToLower() {
    let newVideoList =  [{
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_4A7A0F66D974EF0FDBB04E4586D40C4B",
        "coverUrl": "https://p1.music.126.net/LbE4ApwVeaqTdai-mbG4hw==/109951163600957870.jpg",
        "height": 720,
        "width": 1280,
        "title": "陈慧琳遇上张宇《都是你的错》 英气十足却少了点味道 你觉得呢？",
        "description": null,
        "commentCount": 204,
        "shareCount": 343,
        "resolutions": [{
            "resolution": 240,
            "size": 30583717
          },
          {
            "resolution": 480,
            "size": 52448500
          },
          {
            "resolution": 720,
            "size": 72006833
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 110000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/lA3ttpRl7v44UhkKhoYQ9w==/109951164163223767.jpg",
          "accountStatus": 0,
          "gender": 0,
          "city": 110101,
          "birthday": -2209017600000,
          "userId": 1465856339,
          "userType": 0,
          "nickname": "全球音乐印象馆",
          "signature": "宽泛的涉猎音乐，严谨的分享音乐",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951164163223760,
          "backgroundImgId": 109951162868128400,
          "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "泛生活视频达人"
          },
          "djStatus": 0,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "109951164163223767",
          "backgroundImgIdStr": "109951162868128395",
          "avatarImgId_str": "109951164163223767"
        },
        "urlInfo": {
          "id": "4A7A0F66D974EF0FDBB04E4586D40C4B",
          "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/Qb7Klfun_2042110916_shd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=NeyxxuWeNFQYwNPndwynUIiEBaJsXStK&sign=cd7ad309c520dbc53804d5245927ba8c&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0Xw6M9%2F6EpC7f3gFuA8AG8QJ",
          "size": 72006833,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 720
        },
        "videoGroup": [{
            "id": 57105,
            "name": "粤语现场",
            "alg": "groupTagRank"
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": "groupTagRank"
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [{
          "name": "都是你的错",
          "id": 213326,
          "pst": 0,
          "t": 0,
          "ar": [{
            "id": 7235,
            "name": "陈慧琳",
            "tns": [

            ],
            "alias": [

            ]
          }],
          "alia": [

          ],
          "pop": 100,
          "st": 0,
          "rt": "",
          "fee": 8,
          "v": 14,
          "crbt": null,
          "cf": "",
          "al": {
            "id": 21620,
            "name": "Especial Kelly",
            "picUrl": "http://p3.music.126.net/gLhvoQse-ygSE9P5bwkuRA==/910395627798766.jpg",
            "tns": [

            ],
            "pic": 910395627798766
          },
          "dt": 246595,
          "h": {
            "br": 320000,
            "fid": 0,
            "size": 9865970,
            "vd": -77120
          },
          "m": {
            "br": 192000,
            "fid": 0,
            "size": 5919600,
            "vd": -74672
          },
          "l": {
            "br": 128000,
            "fid": 0,
            "size": 3946414,
            "vd": -73238
          },
          "a": null,
          "cd": "1",
          "no": 12,
          "rtUrl": null,
          "ftype": 0,
          "rtUrls": [

          ],
          "djId": 0,
          "copyright": 1,
          "s_id": 0,
          "mst": 9,
          "cp": 7003,
          "mv": 0,
          "rtype": 0,
          "rurl": null,
          "publishTime": 1164902400000,
          "privilege": {
            "id": 213326,
            "fee": 8,
            "payed": 0,
            "st": 0,
            "pl": 128000,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 999000,
            "fl": 128000,
            "toast": false,
            "flag": 4,
            "preSell": false
          }
        }],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "4A7A0F66D974EF0FDBB04E4586D40C4B",
        "durationms": 239597,
        "playTime": 499007,
        "praisedCount": 1812,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_EB37F4775C9A0BBF9D00013915C11661",
        "coverUrl": "https://p1.music.126.net/cNsMDb7Cgw8fWdpR56_DnA==/109951163376265193.jpg",
        "height": 360,
        "width": 636,
        "title": "《中国好声音》第三季第三期帕尔哈提《你怎么舍得我难过",
        "description": "《中国好声音》第三季第三期帕尔哈提《你怎么舍得我难过》",
        "commentCount": 741,
        "shareCount": 3961,
        "resolutions": [{
          "resolution": 240,
          "size": 73737720
        }],
        "creator": {
          "defaultAvatar": false,
          "province": 710000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/qKDNuVXgQrtFr9zpg5RYZA==/109951165455153391.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 710400,
          "birthday": 653673600000,
          "userId": 279275684,
          "userType": 0,
          "nickname": "MiamiFm",
          "signature": "",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951165455153390,
          "backgroundImgId": 109951164109229180,
          "backgroundUrl": "http://p1.music.126.net/lVUHnc517Y2h5xrWz74KOg==/109951164109229180.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": null,
          "djStatus": 10,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "109951165455153391",
          "backgroundImgIdStr": "109951164109229180",
          "avatarImgId_str": "109951165455153391"
        },
        "urlInfo": {
          "id": "EB37F4775C9A0BBF9D00013915C11661",
          "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/mnxfx5Mo_1720361604_sd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=qjXoMcEqClONqzcFrruqAsJLsVSGIFGj&sign=ff8d629fdd00e19a0cd6c6b019b1283a&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0Xw6M9%2F6EpC7f3gFuA8AG8QJ",
          "size": 73737720,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 240
        },
        "videoGroup": [{
            "id": -8004,
            "name": "#评论榜#",
            "alg": "groupTagRank"
          },
          {
            "id": 77102,
            "name": "内地综艺",
            "alg": "groupTagRank"
          },
          {
            "id": 76108,
            "name": "综艺片段",
            "alg": "groupTagRank"
          },
          {
            "id": 3101,
            "name": "综艺",
            "alg": "groupTagRank"
          },
          {
            "id": 4101,
            "name": "娱乐",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": [
          109
        ],
        "relateSong": [{
          "name": "你怎么舍得我难过",
          "id": 5255637,
          "pst": 0,
          "t": 0,
          "ar": [{
            "id": 3079,
            "name": "黄品源",
            "tns": [

            ],
            "alias": [

            ]
          }],
          "alia": [

          ],
          "pop": 100,
          "st": 0,
          "rt": "600902000007951161",
          "fee": 8,
          "v": 683,
          "crbt": null,
          "cf": "",
          "al": {
            "id": 512088,
            "name": "我们的主打歌",
            "picUrl": "http://p3.music.126.net/QoYAmdyE7FL_vc9rwNeS9w==/64871186055842.jpg",
            "tns": [

            ],
            "pic": 64871186055842
          },
          "dt": 293840,
          "h": {
            "br": 320000,
            "fid": 0,
            "size": 11756191,
            "vd": 11956
          },
          "m": {
            "br": 192000,
            "fid": 0,
            "size": 7053732,
            "vd": 14425
          },
          "l": {
            "br": 128000,
            "fid": 0,
            "size": 4702502,
            "vd": 14509
          },
          "a": null,
          "cd": "1",
          "no": 8,
          "rtUrl": null,
          "ftype": 0,
          "rtUrls": [

          ],
          "djId": 0,
          "copyright": 0,
          "s_id": 0,
          "mst": 9,
          "cp": 7003,
          "mv": 0,
          "rtype": 0,
          "rurl": null,
          "publishTime": 1184169600000,
          "privilege": {
            "id": 5255637,
            "fee": 8,
            "payed": 0,
            "st": 0,
            "pl": 128000,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 999000,
            "fl": 128000,
            "toast": false,
            "flag": 4,
            "preSell": false
          }
        }],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "EB37F4775C9A0BBF9D00013915C11661",
        "durationms": 861610,
        "playTime": 1895867,
        "praisedCount": 12297,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_9268BA5F4D4E53EBC693C3BBCDA2619B",
        "coverUrl": "https://p1.music.126.net/ZxqWdhrMyZ7FV3KNCb4vig==/109951163574243929.jpg",
        "height": 720,
        "width": 1280,
        "title": "Made In China cn IN LA",
        "description": null,
        "commentCount": 126,
        "shareCount": 129,
        "resolutions": [{
            "resolution": 240,
            "size": 3870652
          },
          {
            "resolution": 480,
            "size": 7069706
          },
          {
            "resolution": 720,
            "size": 9455328
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 1000000,
          "authStatus": 1,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/xXYMOoLOlREZwoq_IPdqlQ==/109951163908552597.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 1003100,
          "birthday": 893916000000,
          "userId": 299078392,
          "userType": 4,
          "nickname": "SkinnyTracy",
          "signature": "hip-hop音乐制作人 Beatmaker",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951163908552590,
          "backgroundImgId": 109951163908565250,
          "backgroundUrl": "http://p1.music.126.net/Nq0TK9OeMmTIe3F6_U7oDg==/109951163908565252.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐原创视频达人"
          },
          "djStatus": 10,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "109951163908552597",
          "backgroundImgIdStr": "109951163908565252",
          "avatarImgId_str": "109951163908552597"
        },
        "urlInfo": {
          "id": "9268BA5F4D4E53EBC693C3BBCDA2619B",
          "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/wwH9c642_1925976574_shd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=ruIqwdqsdQxUoiCIqyFNPgkZfTtsrLYq&sign=4471df6870e55c29e788aac44fcab360&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0Xw6M9%2F6EpC7f3gFuA8AG8QJ",
          "size": 9455328,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 720
        },
        "videoGroup": [{
            "id": 14225,
            "name": "欧美明星",
            "alg": "groupTagRank"
          },
          {
            "id": 58104,
            "name": "音乐节",
            "alg": "groupTagRank"
          },
          {
            "id": 57106,
            "name": "欧美现场",
            "alg": "groupTagRank"
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": [
          109
        ],
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "9268BA5F4D4E53EBC693C3BBCDA2619B",
        "durationms": 37000,
        "playTime": 605952,
        "praisedCount": 2087,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_D2A929F12468A80AB9C004672481345A",
        "coverUrl": "https://p1.music.126.net/GM7DkL9GzdhhxuiYWOUdcA==/109951163574077922.jpg",
        "height": 720,
        "width": 1280,
        "title": "Youtube点击破8000万的洗脑神曲，做好心理准备，听懵了",
        "description": "Youtube播放量破8000万的洗脑神曲，务必做好心理准备，听懵了！",
        "commentCount": 435,
        "shareCount": 575,
        "resolutions": [{
            "resolution": 240,
            "size": 36414265
          },
          {
            "resolution": 480,
            "size": 62779523
          },
          {
            "resolution": 720,
            "size": 73384053
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 340000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/C6VID_CReqmt8ETsUWaYTQ==/18499283139231828.jpg",
          "accountStatus": 0,
          "gender": 0,
          "city": 340100,
          "birthday": -2209017600000,
          "userId": 479954154,
          "userType": 201,
          "nickname": "音乐诊疗室",
          "signature": "当我坐在那架破旧古钢琴旁边的时候，我对最幸福的国王也不羡慕。（合作推广请私信，或者+V信：mjs927721）",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 18499283139231828,
          "backgroundImgId": 1364493978647983,
          "backgroundUrl": "http://p1.music.126.net/i4J_uvH-pb4sYMsh4fgQAA==/1364493978647983.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐视频达人",
            "2": "音乐资讯达人"
          },
          "djStatus": 0,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "18499283139231828",
          "backgroundImgIdStr": "1364493978647983",
          "avatarImgId_str": "18499283139231828"
        },
        "urlInfo": {
          "id": "D2A929F12468A80AB9C004672481345A",
          "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/9K339aCC_1836896552_shd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=MqEDMjjXyIxJWcDvWBkWlKRreJKfsfXM&sign=72fbfc793eb3fc4aaccccc350933e65b&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0XzFmis%2BpiGfJfHRk47jfzWq",
          "size": 73384053,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 720
        },
        "videoGroup": [{
            "id": -22915,
            "name": "#Millennium红房子BGM#",
            "alg": "groupTagRank"
          },
          {
            "id": 57106,
            "name": "欧美现场",
            "alg": "groupTagRank"
          },
          {
            "id": 59108,
            "name": "巡演现场",
            "alg": "groupTagRank"
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": "groupTagRank"
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [{
          "name": "Toy",
          "id": 545171821,
          "pst": 0,
          "t": 0,
          "ar": [{
            "id": 13582183,
            "name": "Netta",
            "tns": [

            ],
            "alias": [

            ]
          }],
          "alia": [

          ],
          "pop": 85,
          "st": 0,
          "rt": null,
          "fee": 8,
          "v": 8,
          "crbt": null,
          "cf": "",
          "al": {
            "id": 37909843,
            "name": "Toy",
            "picUrl": "http://p3.music.126.net/1k519G2VJSACGGwpHMdbqg==/109951163187344196.jpg",
            "tns": [

            ],
            "pic_str": "109951163187344196",
            "pic": 109951163187344200
          },
          "dt": 180230,
          "h": {
            "br": 320000,
            "fid": 0,
            "size": 7211929,
            "vd": -20700
          },
          "m": {
            "br": 192000,
            "fid": 0,
            "size": 4327175,
            "vd": -18400
          },
          "l": {
            "br": 128000,
            "fid": 0,
            "size": 2884798,
            "vd": -16900
          },
          "a": null,
          "cd": "1",
          "no": 1,
          "rtUrl": null,
          "ftype": 0,
          "rtUrls": [

          ],
          "djId": 0,
          "copyright": 1,
          "s_id": 0,
          "mst": 9,
          "cp": 405025,
          "mv": 5923018,
          "rtype": 0,
          "rurl": null,
          "publishTime": 1520697600007,
          "privilege": {
            "id": 545171821,
            "fee": 8,
            "payed": 0,
            "st": 0,
            "pl": 128000,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 999000,
            "fl": 128000,
            "toast": false,
            "flag": 256,
            "preSell": false
          }
        }],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "D2A929F12468A80AB9C004672481345A",
        "durationms": 196279,
        "playTime": 777025,
        "praisedCount": 3393,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_5C730A4C2AE1F6CE1285A4C5AEEE3C8B",
        "coverUrl": "https://p1.music.126.net/HfI_YXt1Tyxp7W6zLvurzw==/109951163835633881.jpg",
        "height": 1280,
        "width": 720,
        "title": "PSY.P 被要求在家里团年上台表演young master",
        "description": "PSY.P  被要求在家里团年上台表演young master",
        "commentCount": 785,
        "shareCount": 2044,
        "resolutions": [{
            "resolution": 240,
            "size": 16376315
          },
          {
            "resolution": 480,
            "size": 28031566
          },
          {
            "resolution": 720,
            "size": 39104060
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 1000000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/G10ScRbmE7Jo4eDOEnsqYQ==/109951163830719644.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 1007100,
          "birthday": 971193600000,
          "userId": 1334370625,
          "userType": 0,
          "nickname": "GoodShit好货",
          "signature": "GTD$ 厂牌创始人兼主理人",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951163830719650,
          "backgroundImgId": 109951163747020200,
          "backgroundUrl": "http://p1.music.126.net/dU0_2iapihs4qhVYv_fOGA==/109951163747020189.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": null,
          "djStatus": 10,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "109951163830719644",
          "backgroundImgIdStr": "109951163747020189",
          "avatarImgId_str": "109951163830719644"
        },
        "urlInfo": {
          "id": "5C730A4C2AE1F6CE1285A4C5AEEE3C8B",
          "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/Fbmlc6vS_2294579386_shd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=MTazbpnrcJixqFIqVWXhAoNwniwzJLTv&sign=c5d7f42b16ab4177bfe60aa529598cef&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0Xw6M9%2F6EpC7f3gFuA8AG8QJ",
          "size": 39104060,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 720
        },
        "videoGroup": [{
            "id": -28270,
            "name": "#CDC说唱会馆 海尔兄弟Higher Brothers - Ty#",
            "alg": "groupTagRank"
          },
          {
            "id": 57110,
            "name": "饭拍现场",
            "alg": "groupTagRank"
          },
          {
            "id": 59101,
            "name": "华语现场",
            "alg": "groupTagRank"
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "5C730A4C2AE1F6CE1285A4C5AEEE3C8B",
        "durationms": 118562,
        "playTime": 1711309,
        "praisedCount": 8075,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_54D5245DC382C6879EF7A178B5A83F7F",
        "coverUrl": "https://p1.music.126.net/XprKsrrwJXp6PtfTjiYkxg==/109951163572939763.jpg",
        "height": 720,
        "width": 1280,
        "title": "音乐教父罗大佑多年后再唱经典作品《你的样子》Live",
        "description": "音乐教父罗大佑多年后再唱经典作品《你的样子》，作为华语乐坛的一面旗帜，一个时代的标志，再听他的的作品已是曲中人~",
        "commentCount": 383,
        "shareCount": 896,
        "resolutions": [{
            "resolution": 240,
            "size": 23392002
          },
          {
            "resolution": 480,
            "size": 33351555
          },
          {
            "resolution": 720,
            "size": 53580336
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 110000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/4bvJLzf_NsPcf84OcyPlrA==/19085322835187480.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 110101,
          "birthday": 723139200000,
          "userId": 546876822,
          "userType": 0,
          "nickname": "音悦-留声机",
          "signature": "新浪微博关注@音悦留声机，留住感动你我的瞬间",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 19085322835187480,
          "backgroundImgId": 109951164048935180,
          "backgroundUrl": "http://p1.music.126.net/aPVYpnnPwHhfjx6XCiC6RA==/109951164048935184.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐视频达人"
          },
          "djStatus": 0,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "19085322835187480",
          "backgroundImgIdStr": "109951164048935184",
          "avatarImgId_str": "19085322835187480"
        },
        "urlInfo": {
          "id": "54D5245DC382C6879EF7A178B5A83F7F",
          "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/sHiu8eCB_157339801_shd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=OmHgkjglzxKYQIsXWEVpVMwIxGxyhCdN&sign=7100a1112fde190f276b8b0124a69610&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0Xw6M9%2F6EpC7f3gFuA8AG8QJ",
          "size": 53580336,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 720
        },
        "videoGroup": [{
            "id": 13260,
            "name": "罗大佑",
            "alg": "groupTagRank"
          },
          {
            "id": 13133,
            "name": "经典",
            "alg": "groupTagRank"
          },
          {
            "id": 13222,
            "name": "华语",
            "alg": "groupTagRank"
          },
          {
            "id": 3100,
            "name": "影视",
            "alg": "groupTagRank"
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "54D5245DC382C6879EF7A178B5A83F7F",
        "durationms": 203006,
        "playTime": 926435,
        "praisedCount": 3042,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_531966A7E44A6423CCAC4C158AAF72D7",
        "coverUrl": "https://p1.music.126.net/0XUP4wTd99nCOYtBqT-0Eg==/109951163735412752.jpg",
        "height": 1080,
        "width": 1920,
        "title": "【MAMAMOO】华莎太辣引发韩网争议？你怎么看？",
        "description": "【MAMAMOO】华莎引发韩网争议的三个超辣造型，你怎么看？",
        "commentCount": 1938,
        "shareCount": 1445,
        "resolutions": [{
            "resolution": 240,
            "size": 35969542
          },
          {
            "resolution": 480,
            "size": 61806164
          },
          {
            "resolution": 720,
            "size": 91171237
          },
          {
            "resolution": 1080,
            "size": 150175582
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 310000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/vYHGILLfWWof6ogz1HwxKQ==/109951164491145822.jpg",
          "accountStatus": 0,
          "gender": 2,
          "city": 310101,
          "birthday": 1262275200000,
          "userId": 1335061865,
          "userType": 204,
          "nickname": "lilililiililli",
          "signature": "",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951164491145820,
          "backgroundImgId": 109951164829202080,
          "backgroundUrl": "http://p1.music.126.net/PNGXsjXd_IYT0vvkXeoonQ==/109951164829202086.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐视频达人",
            "2": "音乐图文达人"
          },
          "djStatus": 10,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "109951164491145822",
          "backgroundImgIdStr": "109951164829202086",
          "avatarImgId_str": "109951164491145822"
        },
        "urlInfo": {
          "id": "531966A7E44A6423CCAC4C158AAF72D7",
          "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/ZUQeKMyM_2186847014_uhd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=wRYqPWgZgsrXsrrGrkeSbnBafgECzMNK&sign=8361f459a3c07d69782cf1be9290a704&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0Xw6M9%2F6EpC7f3gFuA8AG8QJ",
          "size": 150175582,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 1080
        },
        "videoGroup": [{
            "id": -8005,
            "name": "#收藏榜#",
            "alg": "groupTagRank"
          },
          {
            "id": 57107,
            "name": "韩语现场",
            "alg": "groupTagRank"
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": "groupTagRank"
          },
          {
            "id": 1101,
            "name": "舞蹈",
            "alg": "groupTagRank"
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "531966A7E44A6423CCAC4C158AAF72D7",
        "durationms": 285942,
        "playTime": 3097034,
        "praisedCount": 15695,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_486D91EACEDE96375950DF59CADABF53",
        "coverUrl": "https://p1.music.126.net/x0PgIiCzxomEuyxnAx4IWw==/109951164544592042.jpg",
        "height": 360,
        "width": 640,
        "title": "Nafla-《you gon need it》给我钱777现场",
        "description": null,
        "commentCount": 44,
        "shareCount": 171,
        "resolutions": [{
            "resolution": 720,
            "size": 29314897
          },
          {
            "resolution": 480,
            "size": 22900748
          },
          {
            "resolution": 240,
            "size": 11474535
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 110000,
          "authStatus": 1,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/dVRuI5INiw606W-FnyGZVQ==/109951164077740534.jpg",
          "accountStatus": 0,
          "gender": 0,
          "city": 110101,
          "birthday": 1539878400000,
          "userId": 1734278812,
          "userType": 0,
          "nickname": "云村有票官方号",
          "signature": "网易云音乐旗下演出票务品牌，提供最新最热演出资讯和票务服务。",
          "description": "网易云音乐旗下演出票务品牌",
          "detailDescription": "网易云音乐旗下演出票务品牌",
          "avatarImgId": 109951164077740530,
          "backgroundImgId": 109951162868128400,
          "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": null,
          "djStatus": 0,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "109951164077740534",
          "backgroundImgIdStr": "109951162868128395",
          "avatarImgId_str": "109951164077740534"
        },
        "urlInfo": {
          "id": "486D91EACEDE96375950DF59CADABF53",
          "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/xhU67Rjc_2836012035_shd.mp4?ts=1609642434&rid=D3F5D0A922C0F2CFE41DAAB8BC2B4AA0&rl=3&rs=yOJCUGfehEvowTYouGuPrfdyuhSibsws&sign=96534531c3175623fabaf34c997f4c02&ext=0%2BvIB6q2Cig1SnXVE%2B2nzE0tnwi3%2BOtdhK4UWdxMtZi9sExCwJdFEelLtWnTNoJ%2BGL2LMjDN3nlTq7uRxz9%2FODIz%2Bh6w1z2llMfgZ2RkzNOlRbIPFzMUnFEYOSzAKViumW5DA%2F2%2BaN97BBOlzoA%2Ffy3EYW65WEf3%2FKkmVlZFmu%2B6ZXaLYTl0Pr1Tsj0N4%2BHSG10dxIGcHD%2FMKoWqGRhIIuw6EqWMhtGtij3Pxepy0Xw6M9%2F6EpC7f3gFuA8AG8QJ",
          "size": 29314897,
          "validityTime": 1200,
          "needPay": false,
          "payInfo": null,
          "r": 720
        },
        "videoGroup": [{
            "id": -34120,
            "name": "#Show Me The Money 777#",
            "alg": "groupTagRank"
          },
          {
            "id": 4107,
            "name": "说唱",
            "alg": "groupTagRank"
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": "groupTagRank"
          },
          {
            "id": 58100,
            "name": "现场",
            "alg": "groupTagRank"
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": "groupTagRank"
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [{
          "name": "you gon need it",
          "id": 435552088,
          "pst": 0,
          "t": 0,
          "ar": [{
            "id": 1182660,
            "name": "nafla",
            "tns": [

            ],
            "alias": [

            ]
          }],
          "alia": [

          ],
          "pop": 100,
          "st": 0,
          "rt": null,
          "fee": 0,
          "v": 6,
          "crbt": null,
          "cf": "",
          "al": {
            "id": 34922024,
            "name": "THIS&THAT",
            "picUrl": "http://p3.music.126.net/WV7lLx5pwQAtepX2iA-UBA==/3416182643891183.jpg",
            "tns": [

            ],
            "pic": 3416182643891183
          },
          "dt": 153650,
          "h": {
            "br": 320000,
            "fid": 0,
            "size": 6153448,
            "vd": -2
          },
          "m": {
            "br": 192000,
            "fid": 0,
            "size": 3692086,
            "vd": -2
          },
          "l": {
            "br": 128000,
            "fid": 0,
            "size": 2461405,
            "vd": -2
          },
          "a": null,
          "cd": "1",
          "no": 2,
          "rtUrl": null,
          "ftype": 0,
          "rtUrls": [

          ],
          "djId": 0,
          "copyright": 0,
          "s_id": 0,
          "mst": 9,
          "cp": 617010,
          "mv": 0,
          "rtype": 0,
          "rurl": null,
          "publishTime": 1422201600007,
          "privilege": {
            "id": 435552088,
            "fee": 0,
            "payed": 0,
            "st": 0,
            "pl": 320000,
            "dl": 320000,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 320000,
            "fl": 320000,
            "toast": false,
            "flag": 256,
            "preSell": false
          }
        }],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "486D91EACEDE96375950DF59CADABF53",
        "durationms": 105526,
        "playTime": 157162,
        "praisedCount": 1019,
        "praised": false,
        "subscribed": false
      }
    }]
    let {videoList} = this.data
    videoList.push(...newVideoList)
    this.setData({videoList})

  },
  // 分享
  onShareAppMessage({from}) {
    if (from === 'button') {
      return {
        title: '来自canoe-云音乐的转发',
        path: '/pages/video/index',
      }
    }
    return {
      title: '来自canoe-云音乐的转发',
      path: '/pages/video/index'
    }
  },
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
})