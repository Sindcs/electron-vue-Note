var crypto = require('crypto')

export default {
  // 获取签名
  getSign: (timstamp, appSecret) => {
    let resultStr = `=+appsecret=${appSecret}?/.timstamp=${timstamp};;]`
    return crypto.createHash('sha1').update(resultStr).digest('hex')
  }
}
