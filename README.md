＃项目：仿网易云音乐小程序

## 用途：个人测试demo

### 功能：

#### 歌曲主页、登录、歌曲搜索、历史记录、热搜榜、每日推荐、推荐歌单、歌单详情、歌曲播放、视频列表、最近播放

** 以下是此项目使用的技术栈

### 1、index(主页页面)

技术栈: 

 ```vue 
/**
 * 接口: 轮播图数据接口 /banner, 推荐歌单接口 /personalized, 排行榜数据接口
 * /top/list， 搜索初始提示接口 /search/default
 * 微信小程序官方api: 无
 * 微信小程序官方事件: wx.navigateTo  路由跳转
 * js: array.slice() 数组截取 array.forEach() 数据循环
 * async await 异步请求
 * promise封装请求
 */
 ```

### 2、login(登录页面)

技术栈: 

```vue
/**
 * 接口: 登录接口 /login/cellphone, 
 * 微信小程序官方api: 无
 * 微信小程序官方事件: wx.navigateBack 返回多级页面,  wx.showToast 显示消息提示框, wx.setStorageSync（存入缓存）
 * async await 异步请求
 * promise封装请求
 */
```

### 3、search(歌曲搜索页面)

技术栈: 

```vue
/**
 * 接口: 搜索初始提示接口 /search/default, 热搜列表接口 /search/hot/detail
 * 搜索接口 /search
 * 微信小程序官方api: 无
 * 微信小程序官方事件: wx.navigateTo  路由跳转, wx.showModal 显示模态对话框,wx.removeStorageSync('key') 清除缓存 
 * js: array.indexOf() 返回指定字符在字符串中第一次出现处的索引,
 * array.unshift() 数组开头添加元素
 * async await 异步请求
 * promise封装请求
 * 函数节流
 */
```

### 4、songListDetails(歌单详情页面)

技术栈: 

```vue
 /**
 * 接口: 歌曲详情接口 /playlist/detail
 * 微信小程序官方api: 无
 * 微信小程序官方事件: wx.navigateTo  路由跳转
 * js: Math.round 四舍五入函数， toFixed(1) 四舍五入为指定小数位数的数字
 * async await 异步请求
 * promise封装请求
 */

```

### 5、user(个人中心页面)

技术栈: 

```vue
/* 接口: 最近播放记录接口 /user/record
* 微信小程序官方api: 无
* 微信小程序官方事件: wx.navigateTo  路由跳转
* async await 异步请求
 * 手指移动
 * transform:变形。改变
 * translate:移动，transform的一个方法
 * transition: 平滑的过渡
* promise封装请求
```

### 6、video(视频页面)

技术栈: 

```vue
/**
 * 接口: 获取视频导航列表接口 /video/group/list， 获取视频列表 /video/group
 * /top/list， 搜索初始提示接口 /search/default
 * 微信小程序官方api: 无
 * 微信小程序官方事件: wx.navigateTo  路由跳转， wx.showLoading() 显示 loading 提示框
 * onShareAppMessage() 分享
 * async await 异步请求
 * promise封装请求
 */
```

### 7、songDetail(歌曲详情页面)

技术栈:

```vue
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
 * 
 */
```

### 8、recommendSong(每日推荐页面)

技术栈:

```vue
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
```

