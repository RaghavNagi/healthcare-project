//First we are initializing jsonwebtoken module to use
// functionalities of JWT eg. sign, verify

const jwt = require('jsonwebtoken');

// After successful Register of user and then calling the login endpoint
// with the already registered user, It will create and return JWT Token.

const createToken = (userData) => {
    return jwt.sign(userData,process.env.PRIVATE_KEY,{expiresIn:400000});
}

// After login, we are getting the token, and
// for validating JWT Token , that it is correct or not, we will
// proceed with secure routes, to GET / POST / UPDATE / DELETE .

const validateJwtToken = (req,res,next)=>{

    //Option1: req header token, authorization not send. (Doesn,t exists)

    const tokenCheck = req.headers.authorization;
    
    if(!tokenCheck) return res.status(401).json({err:'Token not available'});

    // Option2 : req header getting token: But not in right format:
    // Authorization : BASIC/BEARER
    // BASIC btoa(USERNAME:PASSWORD) -> BASIC  ajkfbewhjfbquygh   [BASE64]
    // BEARER jvabnqbbicaqs

    const token = req.headers.authorization.split(' ')[1];

    if(!token){
        return res.status(401).json({err:'Invalid Token'});
    }

    try{
        const validateToken = jwt.verify(token , process.env.PRIVATE_KEY);
        req.user=validateToken;
        next();
    }
    catch(err){
        return res.status(401).json(err.message);
    }
}

module.exports = {createToken,validateJwtToken};