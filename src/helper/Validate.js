module.exports.valiDateMail = function (email) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return email.match(regex);
};

module.exports.valiDatePhone = function (phone) {
  let regex = /^0{1}[0-9]{9}$/
  return phone.match(regex);
};

module.exports.validateNumber = function (number) {
  return ((number && number < 1) || number === 0);
};

module.exports.validateDate = function (date) {
  let date1 = new Date(date);
  return date1.toString() === 'Invalid Date';
};