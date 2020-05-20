import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
async function send(sendInfo) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // *****测试邮箱，如果你没有真实的邮箱的话，这里我们有QQ邮箱****
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",  //必须改成这个服务（因为是这个服务发送邮件的），不然发送不成功
    port: 587,
    secure: false, // true for 465, false for other ports
    //这里填的是我们的QQ邮箱，生成的授权码
    auth: {
      user: '1127071993@qq.com', // generated ethereal user（发件人的邮箱）
      pass: 'whbrhsjrhhnmhhgh' // generated ethereal password（认证后的授权码，安全机制）
    }
  });

//假设是  发送的信息 (已经作为参数传入)
  // let sendInfo = {
  //   code:1234,   //验证码
  //   expire:'2019-10-01', //过期时间
  //   email:'1127071993@qq.com,975969154@qq.com',  //收件人邮箱
  //   user:'xyt1，xyt2'      //收件人
  // }
  
  //假设是重置密码链接
  let url = 'http://www.imooc.com'


  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"认证邮箱" 1127071993@qq.com', // sender address(发件人信息)
    to: sendInfo.email, // list of receivers(收件人信息)
    subject: sendInfo.user !== ''?`你好开发者，${sendInfo.user}! <慕课网前端全栈实践>注册码`:`<慕课网前端全栈实践>注册码`, // Subject line
    text: `您在《慕课网前端全栈实践》课程中注册，您的邀请码是:${sendInfo.code},过期时间为:${sendInfo.expire}`, // plain text body
    html: `
     <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
        <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">Imooc社区——欢迎来到官方社区</div>
        <div style="padding: 25px">
          <div>您好，${sendInfo.user}童鞋，重置链接有效时间30分钟，请在${sendInfo.expire}之前重置您的密码：</div>
          <a href="${url}" style="padding: 10px 20px; color: #fff; background: #009e94; display: inline-block;margin: 15px 0;">立即重置密码</a>
          <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行激活！否则你的邮箱将会被他人绑定。</div>
        </div>
        <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
    </div>` // html body
  });

  //发送结束后返回的信息
  return "Message sent: %s", info.messageId

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);

export default send