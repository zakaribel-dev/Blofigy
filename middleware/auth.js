const jwt = require("jsonwebtoken");

function checkUser(req, res, next) {
  const token = req.cookies.token; 

  if (!token) {
    req.user = null; 
    return next(); 
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("omg.. erreur avec le token..", err);
      req.user = null; 
    } else {
      req.user = user; // j'applique mon user "tokenifié" si j'puis dire à mon user de mes requêtes
    }
    next(); 

    if (!req.user) {
      return res.redirect('/?error=Vous êtes pas connecté'); 
    }   
  });
}

module.exports = {
  checkUser,
};