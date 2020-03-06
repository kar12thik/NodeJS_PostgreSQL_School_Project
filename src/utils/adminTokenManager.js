const jwt = require("jsonwebtoken");
const adminTokenGenerator = ({
  id = "",
  email = "",
  firstName = "",
  lastName = ""
} = {}) => {
  const token = jwt.sign(
    {
      sub: "admin",
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

const adminTokenValidator = (token = "") => {
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};
exports.adminTokenGenerator = adminTokenGenerator;
exports.adminTokenValidator = adminTokenValidator;
