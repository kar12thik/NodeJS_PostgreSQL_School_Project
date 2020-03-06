const jwt = require("jsonwebtoken");
const studentTokenGenerator = ({
  id = "",
  email = "",
  firstName = "",
  lastName = ""
} = {}) => {
  const token = jwt.sign(
    {
      sub: "student",
      id,
      email,
      firstName,
      lastName
    },
    process.env.JWT_KEY,
    {
      expiresIn: "2 years"
    }
  );
  return token;
};

const studentTokenValidator = (token = "") => {
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};
exports.studentTokenGenerator = studentTokenGenerator;
exports.studentTokenValidator = studentTokenValidator;
