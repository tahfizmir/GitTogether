const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter both first name and last name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Not a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak password");
  }
};
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};
module.exports = {validateSignUpData,validateEditProfileData};
