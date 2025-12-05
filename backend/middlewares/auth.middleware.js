
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message: "Token is not found"});
        }
        //if token exist verify it
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId;

        next();
    }catch(error){
        return res.status(500).json({message: "auth Middleware Error"});
    }
}

export default authMiddleware;