import popCore from '@alicloud/pop-core';




export default ({
  accessKey,
  secretKey,
  regionId,
  smsSign
}, params) => {
  const shortMessage = new popCore.ShortMessage({
    accessKeyId: accessKey,
    accessKeySecret: secretKey
  });
  return new Promise((resolve, reject) => {
    const data = {
      RegionId: regionId,
      PhoneNumbers: params.phone,
      SignName: smsSign,
      TemplateCode: params.code,
      TemplateParam: JSON.stringify(params)
    };
    // 发送短信
    shortMessage.sendSms(data).then((result) => {
      resolve(result)
    }).catch((error) => {
      reject(error)
    });
  })
}