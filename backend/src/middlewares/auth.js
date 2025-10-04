const jwt = require("jsonwebtoken");

//this function is to check if user loged in
// exports.authMiddleware = (req, res, next) => {
//     const token = req.header("Authorization")?.split(" ")[1];
//     if(!token) return res.status(401).json({ message: "No token, authorization denied" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRETE);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({message: "Token is not valid"});
//     }
// };

exports.adminMiddleware = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({ message: "Acess denied: Admin only"});
    }
    next();
};

exports.verifyToken = (req, res, next) => {
  // Check for token in Authorization header: "Bearer <token>"
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded { id, role } to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

exports.verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
