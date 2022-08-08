const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = () => {
    return (req, res, next) => {   
        const authToken = req.headers.authorization || "";

        if (!authToken) {
            next(createHttpError(401, "Token is missing"));
        }

        try {
            const payload = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);                  
            res.locals.userId = payload.id;
            
            next();

        } catch (err) {
            console.log(err);
            next(createHttpError(401, "Invalid Token"));
        }    
    }    
}