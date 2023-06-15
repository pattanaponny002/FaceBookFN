const pattern_username_or_password = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,10}/
);
const pattern_email = new RegExp(
  /^[A-Za-z0-9]{1,9}@+(gmail|email|hotmail)+.+(com|co.th)+$/
);
const pattern_phone_number = new RegExp(/(08|09)\d{8}$/);
export const patterns_check = {
  username: pattern_username_or_password,
  password: pattern_username_or_password,
  // email: pattern_email,
  phone_number: pattern_phone_number,
};
