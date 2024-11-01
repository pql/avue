import nodemailer from 'nodemailer';

export default ({
  username,
  password,
  pushName,
  content,
  senderEmail,
  recipientEmail,
  emailHost,
  emailPort
}) => {
  let transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort == 465,
    auth: {
      user: username,
      pass: password
    },
    debug: true
  }, {
    from: senderEmail, //发送者邮箱
    headers: {
      'X-Laziness-level': 1000
    }
  });
  let message = {
    to: recipientEmail,
    subject: pushName,
    html: content,
    attachments: []
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
      transporter.close();
    })
  })
}