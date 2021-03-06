// pages/beauty/beauty.js
const SystemUtil = require('../../utils/SystemsUtil.js').default;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},    //个人信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getMainInfo();
  },
  // getMainInfo:function(){
  //   SystemUtil.commonGet({
  //     url:'/user/get_personal_info',
  //     success:(res)=>{
  //       console.log(res)
  //     },
  //     fail:(err)=>{
  //       console.log(err)
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo
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
  showSearch:function(){
    wx.navigateTo({
      url: './search/search',
    })
  },
  showDetails:function(){
    wx.navigateTo({
      url: './baseContent/quesetionDetail',
    })
  },
  showFans: function () {
    wx.navigateTo({
      url: '/pages/my/fans/myFans',
    })
  },
  toFocus:function(){
    wx.navigateTo({
      url: '/pages/my/focus/myFocus'
    })
  }
})