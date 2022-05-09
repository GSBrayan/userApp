const jwt = require("jsonwebtoken");

const config = process.env;

const checkToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Se necesita token para auth");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Token Invalido");
  }
  return next();
};

module.exports = checkToken;
