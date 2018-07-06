//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        wx.request({
          url: 'https://linshubin.top/beauty/public/index.php/api/v1/token/user',
          data:{ code:res.code },
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          method:'POST',
          success:(res)=>{
            // console.log(res.data.token)
            wx.setStorageSync('chatSessionKey', res.data.token)
          },
          fail:(err)=>{
            wx.showModal({
              title: '提示',
              content: result.msg || '自动登录异常',
              showCancel: false
            })
          }
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail:res => {
              console.log(res)
            }
          })
        }
      // }
    })
  },
  getUserInfo:function(cb,fun){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success:function(loginRes){
          wx.getUserInfo({
            success:function(res){
              console.log(res)
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
              wx.request({
                url: 'https://linshubin.top/beauty/public/index.php/api/v1/token/user',
                data: { code: loginRes.code, encrytedData: res.encryptedData, iv: res.iv },
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                success:function(re){
                  //console.log(re)
                  var unionId = that.globalData.unionId = re.data.unionId;
                  wx.setStorageSync('openId', re.data.openId);
                  wx.setStorageSync('unionId', unionId)
                  console.log(wx.getStorageSync('unionId'));
                }
              })
            },
            fail:function(err){
              console.log(err);
              // wx.redirectTo({
              //   url: '',
              // })
            }
          })
        }
      })
    }
  },
  get_userInfo:function(cb){
    
  },
  globalData: {
    userInfo: null,
    unionld:null
  }
})