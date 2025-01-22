import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // console.log(req.cookies);
  const token = req.cookies.access_token;
  // console.log(token);

  if (!token) {
    return res.status(401).json("Unauthorised User");
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(401).json("Unauthorised User");
    }

    // console.log(user);

    req.user = user;
    next();
  });
};

export default verifyToken;
