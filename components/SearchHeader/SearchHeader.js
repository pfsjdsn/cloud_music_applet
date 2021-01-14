// components/SearchHeader/SearchHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchContent: {
      type: String,
      value: ''
    },
    placeholderContent: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInputChange(e) {
      let eObject = e.detail.value      
      this.triggerEvent('handleInputChange',{value:eObject})
    },
    clearSearchContent() {
      this.triggerEvent('clearSearchContent')
    },
    handInputFocus() {
      this.triggerEvent('handInputFocus')
    },
    getSearchList() {
      this.triggerEvent('getSearchList')
    }
  }
})
