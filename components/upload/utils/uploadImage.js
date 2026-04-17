/** 上传图片至微信云开发存储 */
function uploadImage(configs, image, callback = null) {
  const extMatch = image.match(/\.[^.]+?$/);
  const fileExtension = extMatch ? extMatch[0] : '.png';
  const cloudPath = 'uploads/' + Date.now() + Math.floor(Math.random() * 1000) + fileExtension;
  
  wx.cloud.uploadFile({
    cloudPath: cloudPath,
    filePath: image,
    success: res => {
      // 模拟 Qiniu 的返回结构，保持兼容性
      const mockQiniuRes = {
        key: res.fileID,
        imageURL: res.fileID
      };
      if (callback) callback(mockQiniuRes);
    },
    fail: err => {
      console.error('云开发上传失败', err);
      if (callback) callback({ error: err });
    }
  });
}

module.exports = {
  upload: uploadImage
}