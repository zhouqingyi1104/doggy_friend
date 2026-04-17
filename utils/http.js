const config = require("./../config.js");
const app = getApp();

/**
* 登录获取token (2026 Modern Standard & Donut Multi-platform)
*/
const login = function (_method = null, _url = null, _data = null, callback = null) {
  return new Promise((resolve, reject) => {
    // Multi-platform App (Donut) fallback: wx.login doesn't work on native App
    let isApp = false;
    if (wx.getDeviceInfo && wx.getAppBaseInfo) {
      const deviceInfo = wx.getDeviceInfo();
      const baseInfo = wx.getAppBaseInfo();
      // baseInfo.host.env typically tells us if it's running outside standard wechat
      isApp = baseInfo.host && baseInfo.host.env === 'donut' || deviceInfo.platform === 'android' || deviceInfo.platform === 'ios';
    } else {
      // Fallback for older base libraries
      const systemInfo = wx.getSystemInfoSync();
      isApp = systemInfo.environment === 'mac' || systemInfo.platform === 'android' || systemInfo.platform === 'ios';
    }

    const doLogin = (code) => {
      post("/login", {
        encrypted_data: "mock_encrypted_data",
        code: code,
        iv: "mock_iv",
        app_id: config.alianceKey
      }).then(res => {
        if (res.data.error_code == 0 || res.data.code === 200) {
          wx.setStorageSync('token', res.data.data);
          console.log('token:' + res.data.data);
          
          let finalPromise;
          if (_method) {
            finalPromise = httpRequest(_method, _url, _data);
          } else {
            finalPromise = Promise.resolve(res);
          }
          
          finalPromise.then(result => {
            if (callback) callback(result);
            resolve(result);
          }).catch(reject);
        } else {
          reject(new Error('登录失败'));
        }
      }).catch(err => {
        console.error(err);
        reject(err);
      });
    };

    if (isApp && !wx.canIUse('login')) {
      // In a real multi-platform App, you'd use mobile auth like WeChat SDK
      // For now, mock a code to pass to your backend
      doLogin("app_mock_code");
    } else {
      wx.login({
        success: loginResult => {
          doLogin(loginResult.code);
        },
        fail: err => {
          console.error(err);
          reject(err);
        }
      });
    }
  });
}

/**
* 获取用户信息 (兼容旧方法)
*/
const getUserInfo = login;

/**
 * get
 */
const get = function (_url, _data, callback) {
  return httpRequest("GET", _url, _data, callback);
}

/**
 * post
 */
const post = function (_url, _data, callback) {
  return httpRequest("POST", _url, _data, callback);
}

/**
 * put
 */
const put = function (_url, _data, callback) {
  return httpRequest("PUT", _url, _data, callback);
}

/**
 * delete
 */
const httpDelete = function (_url, _data, callback) {
  return httpRequest("DELETE", _url, _data, callback);
}

/**
 * patch
 */
const patch = function (_url, _data, callback) {
  return httpRequest("PATCH", _url, _data, callback);
}

/** 
* 封装微信http请求 (Promise化)
*/
const httpRequest = function (_method, _url, _data, callback) {
  return new Promise((resolve, reject) => {
    _data = _data || {};
    _data.app_code = config.alianceKey;
    let token = wx.getStorageSync('token');
    
    wx.request({
      url: config.domain + _url,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method: _method,
      data: _data,
      success: function (res) {
        // Normalize response from new backend
        if (res.data && res.data.code !== undefined) {
          if (res.data.code === 200) {
            res.data.error_code = 0;
          } else if (res.data.code === 401) {
            res.data.error_code = '5000';
          } else {
            res.data.error_code = res.data.code;
          }
        }
        if (res.data && res.data.message && !res.data.error_message) {
          res.data.error_message = res.data.message;
        }

        const isTokenError = res.data.error_code == '5000' || res.data.code === 401;
        const isSuccess = res.data.error_code == 0 || res.data.code === 200;
        const errorMsg = res.data.error_message || res.data.message || '请求失败';

        if (isTokenError) {
          if (app) app.globalData.authStatus = true;
          if (callback) callback(res);
          resolve(res);
          wx.showToast({
            title: errorMsg,
            icon:"none"
          });
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/personal/index_2/personal?status=ture'
            })
          }, 1500);
        } else {
          if (!isSuccess) {
            wx.showToast({
              title: errorMsg,
              icon:"none"
            });
          }
          if (callback) callback(res);
          resolve(res);
        }
      },
      fail: function (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}

/**
 * 获取新的消息盒子
 */
const getNewInbox = function(type, callback) {
  this.get(`/new/${type}/inbox`, {}, function (res) {
    callback(res);
  });
}

/**
 * 收集form id
 */
const collectFormId = function(formId) {
  this.post(`/save_form_id`, {
    form_id: formId
  }, function (res) {
    console.log(res);
  });
}

module.exports = { get, post, patch, put, httpDelete, httpRequest, login, getNewInbox,collectFormId}

