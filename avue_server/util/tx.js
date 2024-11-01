import QcloudSms from 'qcloudsms';



export default ({
  appId,
  appKey,
  smsSign
}, params) => {
  const appid = appId
  const appkey = appKey
  const phoneNumber = [params.phone];
  const templateId = params.code;
  const smsSign = smsSign
  const smsType = 0;

  return new Promise((resolve, reject) => {
    // 实例化QcloudSms对象
    const qcloudsms = QcloudSms(appid, appkey);
    let paramList = Object.keys(params).filter(ele => !['phone', 'code'].includes(ele)).map((key) => params[key]);
    // 发送短信
    qcloudsms.SmsMultiSender.sendWithParam(
      86,
      phoneNumber,
      templateId,
      paramList,
      smsSign,
      smsExt,
      smsType,
      function (err, res, resData) {
        if (err) reject(err)
        else resolve()
      }
    );
  })
}