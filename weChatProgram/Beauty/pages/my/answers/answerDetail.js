// pages/my/answers/answerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPraise: false,     //是否点赞
    isDerogatory: false,   //是否点贬
    isSave: false, //是否收藏
    isFocus: false, //是否关注
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //点赞
  clickPraise: function () {
    this.setData({
      isPraise: true
    })
  },
  //贬
  clickDerogatory: function () {
    this.setData({
      isDerogatory: true
    })
  },
  //收藏
  clickSave: function () {
    this.setData({
      isSave: !this.data.isSave
    })
  },
  //关注
  clickFocus: function () {
    this.setData({
      isFocus: !this.data.isFocus
    })
  },
  // 去回答
  toAnswer: function () {
    wx.navigateTo({
      url: '/pages/beauty/baseContent/writerAnswer',
    })
  },
  //全部回答
  showAnswers: function () {
    wx.navigateTo({
      url: '/pages/beauty/baseContent/allAnswer'
    })
  }
})