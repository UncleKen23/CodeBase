'use strict';

import SystemConfig from 'SystemsConfig.js';
let utils = require('./util.js');
let Promise = require('./libs/es6-promise');

let SystemUtil = {
  config: SystemConfig, //获取缓存以及登录相关信息
  systemInfo : {},   //系统信息
  userInfo: {},     //用户信息
  init: function(){
    this.systemInfo = wx.getSystemInfoSync();
    wx.removeStorageSync(SystemConfig.serverSessionKey);
  },
  isLogin:function(){           //判断是否登录，与服务器连接着
    let sessionid = wx.getStorageSync(this.config.serverSessionKey);
    if(!sessionid || !this.userInfo || this.userInfo.id < 0){
      return false;
    }
    return true;
  },
  getUserInfo: function () {                //获取用户信息
    return this.userInfo;
  },

  /**
     * @method
     * 判断系统ios?android并返回系统信息
     */
  getSystemInfo: function () {              //获取系统信息
    const res = wx.getSystemInfoSync();
    return {
      isIos: res.system.toUpperCase().indexOf('IOS') != -1,
      screenHeight: res.screenHeight,
      screenWidth: res.screenWidth,
      windowHeight: res.windowHeight,
      windowWidth: res.screenWidth,
      version: res.version,
      fontSizeSetting: res.fontSizeSetting,
      SDKVersion: res.SDKVersion
    }
  },

  canIUseApi: function (apiStr) {      //检查接口是否在当前版本可用
    if (wx.canIUse(apiStr)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        content: '为了获得更好的体验请您先升级微信版本',
        showCancel: false,
      })
    }
  },

  /**
     * @method
     * 通用的GET请求，请求数据以键值对的方式
     *
     * @param {Object} options 登录配置
     * @param {string} options.url 请求链接，可写相对路径或者完整链接
     * @param {boolean} options.needLoginAuth 发起请求前是否要进行登录状态校验，默认true
     * @param {boolean} options.showLoading 请求时是否显示loading状态，默认false
     * @param {boolean} options.loadingText 请求时显示loading的提示语，默认'请求中'
     * @param {Object} [options.data] 请求参数数据
     * @param {Function} options.success(response) 请求成功时的回调
     * @param {Function} options.fail(response) 请求失败时的回调
     * @param {Function} options.complete(response) 完成请求时的回调
     */
  commonGet: function (options) {
    let This = this;
    let header = utils.extend(options.header || {}, { 'content-type': 'application/x-www-form-urlencoded' });
    options.header = header;
    let opt = utils.extend({ needLoginAuth: true }, options, { method: 'GET' });
    if (opt.needLoginAuth) {
      this.loginAuth({
        whenLogined: function () {
          This.doRequest(opt);
        }
      });
    } else {
      this.doRequest(opt);
    }
  },
  /**
   * @method
   * 通用的POST请求，请求数据以键值对的方式
   *
   * @param {Object} options 登录配置
   * @param {string} options.url 请求链接，可写相对路径或者完整链接
   * @param {boolean} options.needLoginAuth 发起请求前是否要进行登录状态校验，默认true
   * @param {boolean} options.showLoading 请求时是否显示loading状态，默认false
   * @param {boolean} options.loadingText 请求时显示loading的提示语，默认'请求中'
   * @param {boolean} options.sendJson 请求数据是否以json方式提交，默认false
   * @param {Object} [options.data] 请求参数数据
   * @param {Function} options.success(response) 请求成功时的回调
   * @param {Function} options.fail(response) 请求失败时的回调
   * @param {Function} options.complete(response) 完成请求时的回调
   */
  commonPost: function (options) {
    let This = this;
    let contentType = options.sendJson ? 'application/json' : 'application/x-www-form-urlencoded';
    let header = utils.extend(options.header || {}, { 'content-type': contentType });
    options.header = header;
    let opt = utils.extend({ needLoginAuth: true }, options, { method: 'POST' });
    if (opt.needLoginAuth) {
      this.loginAuth({
        whenLogined: function () {
          This.doRequest(opt);
        }
      });
    } else {
      this.doRequest(opt);
    }
  },

  loginAuth: function (options) {         //登录权限
    let This = this;
    let opt = utils.extend({ whenLogined: function () { }, whenLoginFailed: function () { } }, options);
    let sessionid = wx.getStorageSync(this.config.serverSessionKey);
    if (!sessionid) {
      this.wxLogin(opt);
    } else {
      wx.checkSession({
        success: function () {//session 未过期，并且在本生命周期一直有效
          opt.whenLogined(This.userInfo);
        },
        fail: function () {//登录态过期                   
          This.wxLogin(opt);
        }
      })
    }
  },

  wxLogin: function (options) {          //微信登录
    //console.log('wx login..');
    let This = this;
    wx.login({
      success: function (loginResult) {
        // console.log('loginResult:', loginResult)
        if (loginResult.code) {
          wx.setStorageSync(SystemConfig.loginSessionCodeKey, loginResult.code);
          let opt = utils.extend({ whenLogined: function () { }, whenLoginFailed: function () { } }, options);
          wx.getUserInfo({
            withCredentials: true,
            success: function (info) {       
              // console.log(info)

              wx.setStorageSync(SystemConfig.userInfoKey, info.userInfo);
              opt.whenLogined(info.userInfo);

              // let loginOptions = {          //向后台发送数据
              //   url: '/miniapp/MiniChat/wxlogin',
              //   needLoginAuth: false,
              //   showLoading: true,
              //   loadingText: '登录中',
              //   data: {
              //     code: loginResult.code,
              //     encryptedData: info.encryptedData,
              //     iv: info.iv
              //   },
              //   success: function (result) {
              //     //console.log('result.data.chatSessionKey:' + result.data.chatSessionKey);
              //     //console.log('userInfo:', result.data.userInfo);
              //     wx.setStorageSync(SystemConfig.serverSessionKey, result.data.chatSessionKey);
              //     wx.setStorageSync(SystemConfig.userInfoKey, result.data.userInfo);
              //     This.userInfo = result.data.userInfo;
              //     opt.whenLogined(result.data.userInfo);//登录成功后执行回调
              //   },
              //   fail: function (result) {
              //     wx.showModal({
              //       title: '提示',
              //       content: result.msg || '自动登录异常',
              //       showCancel: false
              //     })
              //   }
              // }

              // This.commonPost(loginOptions);
            },
            fail: function (res) {
              //console.log('用户拒绝授权，跳转到登录页面！' + res.errMsg)
              wx.showModal({
                title: '提示',
                content: '亲，请先授权后再访问系统',
                showCancel: false,
                success: function (res) {
                  console.log(res)
                  // if (res.confirm) {
                  //   SystemUtil.openWxSetting({
                  //     scope: 'userInfo',
                  //     whenAllow: function () {
                  //       SystemUtil.wxLogin({
                  //         whenLogined: SystemUtil.hxAccountLogin
                  //       });
                  //     },
                  //     whenDeny: function () {

                  //     }
                  //   });
                  // }
                }
              })
            }
          })

        } else {
          wx.showModal({
            title: '提示',
            content: '获取微信用户信息失败，请检查网络状态',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //This.wxLogin();
              }
            }
          })

        }
      },
      fail: function (res) {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    })
  },

  doRequest: function (options) {           //发送请求
    let that = this;
    let originHeader = options.header || {};
    let sessionid = wx.getStorageSync(this.config.serverSessionKey) || '';
    let commonHeader = {
      chatSessionKey: sessionid,
      deviceModel: this.systemInfo.model,
      systemInfo: this.systemInfo.system,
      wxVersion: this.systemInfo.version,
      version: this.version
    }
    options.header = utils.extend(originHeader, commonHeader);
    let opt = utils.extend({
      data: {}, showLoading: false, loadingText: '请求中', success: function () { },
      fail: function () { }, complete: function () { }
    }, options);
    //let opt = options;
    if (opt.showLoading) {
      if (wx.showLoading) {
        wx.showLoading({
          title: opt.loadingText
        });
      } else {
        wx.showToast({
          title: opt.loadingText,
          icon: 'loading',
          duration: 3000
        })
      }
    }
    if (!opt.url.startsWith('http')) {
      opt.url = SystemConfig.serverUrl + opt.url;
    }
    wx.request({
      url: opt.url,
      data: opt.data,
      header: opt.header,
      method: opt.method,
      success: function (res) {
        if (opt.resolve) {
          console.log(opt.resolve)
          opt.resolve(res)
        }
        if (opt.showLoading) {
          if (wx.hideLoading) {
            wx.hideLoading();
          } else {
            wx.hideToast();
          }
        }
        // let apiCode = res.data.apiCode;
        // if (apiCode && apiCode === '8002') {//未登录
        //   wx.showModal({
        //     title: '提示',
        //     content: '请先登录',
        //     showCancel: false,
        //     success: function (r) {
        //       if (r.confirm) {
        //         SystemUtil.wxLogin({
        //           whenLogined: SystemUtil.hxAccountLogin
        //         });
        //       }
        //     }
        //   })
        // } else {
        //   if (res.data.success) {
        //     opt.success(res.data);
        //   } else {
        //     if (opt.fail) {
        //       opt.fail(res.data);
        //     } else {
        //       wx.showModal({
        //         title: '提示',
        //         content: res.data.msg || '对不起，请求出错了',
        //         showCancel: false
        //       })
        //     }
        //   }
        // }
      },
      fail: function (res) {
        console.log('request error:', res)
        if (opt.showLoading) {
          if (wx.hideLoading) {
            wx.hideLoading();
          } else {
            wx.hideToast();
          }
        }
        let msg = '对不起，系统请求异常';
        if (res.errMsg && res.errMsg.indexOf('timeout') != -1) {
          msg = '请求超时';
        }
        wx.showModal({
          title: '提示',
          content: msg,
          showCancel: false
        })
      },
      complete: function (res) {
        opt.complete();
      }
    })
  },

  openWxSetting: function (option) {      //打开设置
    let opt = utils.extend({ scope: '', whenAllow: function () { }, whenDeny: function () { } }, option);
    wx.openSetting({
      success: function (res) {
        //console.log('授权结果：', res);
        let result = res.authSetting;
        if (opt.scope == 'userInfo') {
          if (result['scope.userInfo']) {
            opt.whenAllow();
          } else {
            opt.whenDeny();
          }
        } else if (opt.scope == 'record') {
          if (result['scope.record']) {
            opt.whenAllow();
          } else {
            opt.whenDeny();
          }
        }
      }
    })
  },

  /**
   * @method
   * 多图上传
   * 
   * @param {String} uploadUrl 请求参数数据
   * @param {Array} filePaths 图片路径数组
   * @param {Number} currIndex 当前上传的图片filePaths的下标 
   */
  uploadPictures: function (uploadUrl, filePaths, currIndex) {
    wx.uploadFile({
      url: uploadUrl,
      filePath: filePaths[currIndex],
      name: '',
      success: (res) => { },
      fail: () => { },
      complete: () => {
        currIndex++;
        if (currIndex === filePaths.length) {
          SystemUtil.showToast('图片上传完毕', 'success', 1500);
        } else {
          SystemUtil.uploadPictures(uploadUrl, filePaths, currIndex);
        }
      }
    })
  },

  /**
     * @method
     * rpx单位转化px
     * 
     * @param {Number} screenWidth  屏幕宽度 单位PX
     * @param {Number} rpxVal 需要转化的rpx单位数值
     */
  transformRpxToPx: function (screenWidth, rpxVal) {
    const ratio = screenWidth / 750;
    return ratio * rpxVal;
  },

  /**
     * @method
     * 使用Promise包装异步请求
     * 
     * @param {wxFuntion} wxFun  以success和fail返回结果的异步函数
     */
  packPromise: function (asyncFun) {
    return function (options = {}) {
      return new Promise((resolve, reject) => {
        options.success = function (res) {
          resolve(res)
        }
        options.fail = function (err) {
          reject(err)
        }

        asyncFun(options)
      })
    }
  }

}


module.exports = {
  default: SystemUtil
}