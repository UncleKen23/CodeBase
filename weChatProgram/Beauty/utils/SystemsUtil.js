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

  getSessionKey:function(){
    wx.request({
      url: 'https://linshubin.top/beauty/public/index.php/api/v1/token/user',
      data: { code: res.code },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: (res) => {
        // console.log(res.data.token)
        wx.setStorageSync('chatSessionKey', res.data.token)
      },
      fail: (err) => {
        wx.showModal({
          title: '提示',
          content: result.msg || '自动登录异常',
          showCancel: false
        })
      }
    });
  },

  doRequest:function(opt){
    let originHeader = opt.header || {};
    let sessionid = wx.getStorageSync(this.config.serverSessionKey) || '';
    let commonHeader = {
      chatSessionKey: sessionid,
    }
    opt.header = utils.extend(originHeader, commonHeader);
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
        let apiCode = res.data.apiCode;
        if (apiCode && apiCode === '8002') {//未登录
          wx.showModal({
            title: '提示',
            content: '请先登录',
            showCancel: false,
            success: function (r) {
              if (r.confirm) {
                SystemUtil.wxLogin({
                  whenLogined: SystemUtil.hxAccountLogin
                });
              }
            }
          })
        } else {
          if (res.data.success) {
            opt.success(res.data);
          } else {
            if (opt.fail) {
              opt.fail(res.data);
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg || '对不起，请求出错了',
                showCancel: false
              })
            }
          }
        }
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