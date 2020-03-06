const jwt = require("jsonwebtoken");
const teacherTokenGenerator = ({
  id = "",
  email = "",
  firstName = "",
  lastName = ""
} = {}) => {
  const token = jwt.sign(
    {
      sub: "teacher",
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

const teacherTokenValidator = (token = "") => {
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.teacherTokenGenerator = teacherTokenGenerator;
exports.teacherTokenValidator = teacherTokenValidator;
