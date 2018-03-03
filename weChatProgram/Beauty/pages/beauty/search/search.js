// pages/beauty/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:""
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
  //取消并回到前一页
  cancel:function(){
    wx.navigateBack({
      delta:''
    })
  },
  //清除表单的input内容
  clear:function(){
    this.setData({
      content : ""
    })
  },
  //搜素功能
  searchContent:function(e){
    console.log(e);
  },
  //把input的内容存起来
  saveContent:function(e){
    let content = e.detail.value;
    this.setData({
      content
    })
  }
})