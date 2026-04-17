const http = require("./http.js");

const getQiniuToken = function(call){
  // 不再需要请求七牛 Token，因为已切换至微信云开发存储
  // 直接模拟成功回调，兼容原逻辑
  call("cloudbase_token_mock");
}

module.exports = {
  getQiniuToken
}