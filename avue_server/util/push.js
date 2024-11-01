import axios from 'axios';
import crypto from 'crypto'

// 计算加签
function getDingTalkSign(secret, timestamp) {
  const stringToSign = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac('SHA256', secret);
  hmac.update(stringToSign);
  const sign = hmac.digest('base64');
  return sign;
};
export default (url, secret, content) => {
  const timestamp = Date.now();
  const signature = getDingTalkSign(secret, timestamp);
  axios.post(`${url}&timestamp=${timestamp}&sign=${encodeURIComponent(signature)}`, {
    msgtype: 'text',
    text: {
      content: content
    }
  })
}