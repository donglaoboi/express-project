const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports.sendMail = function (data, link) {
  const tranporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILUSERNAME,
      pass: process.env.EMAILPASSWORD,
    },
  });
  const user = {
    id: data.id,
    verifyCode: data.verifyCode,
  };
  let token = jwt.sign(user, process.env.PRIVATEKEY);
  const option = {
    from: process.env.EMAILUSERNAME,
    to: data.email,
    subject: "config your email",
    text: `${data.verifyCode} `,
    html: `<a href=${link}${token}>click the following link for config account</a>`,
  };
  tranporter.sendMail(option, function (err, info) {});
};

module.exports.random = function () {
  const str = "0123456789abcdqewryuiokg";
  let OTP = "";

  const len = str.length;
  for (let i = 0; i < 6; i++) {
    OTP += str[Math.floor(Math.random() * len)];
  }
  return OTP;
};

module.exports.sendMailFlashSale = function (data, flashSale) {
  const tranporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILUSERNAME,
      pass: process.env.EMAILPASSWORD,
    },
  });
  const option = {
    from: process.env.EMAILUSERNAME,
    to: data.email,
    subject: `${flashSale.name}`,
    text: `${flashSale.name} `,
    html: `<html><b>${flashSale.description}</b></html>`,
  };
  tranporter.sendMail(option, function (err, info) {});
};
