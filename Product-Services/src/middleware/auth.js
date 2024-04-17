const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "User not Validated",
        });
      } else {
        const userRole = decode.role;
        if (userRole !== "admin") {
          return res.status(403).send({
            success: false,
            message:
              "Access Denied",
          });
        }
        req.body.id = decode.id;
        next();
      }
    });
  } catch (err) {
    console.log("middleware error", err);
    res.status(500).send({
      success: false,
      message: "ERROR IN AUTH API",
      err,
    });
  }
};
