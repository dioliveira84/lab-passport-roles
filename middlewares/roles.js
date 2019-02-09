

const rolesMiddleware = {
  checkBoss: () => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "BOSS") {
        return next();
      } else {
        res.send('You are not authorized')
      }
    }
  },
  checkTA: () => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "TA") {
        return next();
      } else {
        res.send('You are not authorized')
      }
    }
  },
  checkStaff: () => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === "TA" || req.user.role === "BOSS") {
        return next();
      } else {
        res.send('You are not authorized')
      }
    }
  }
}


module.exports = {checkBoss, checkTA, checkStaff} = rolesMiddleware;