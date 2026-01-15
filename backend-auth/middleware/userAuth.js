
import jwt from "jsonwebtoken";

const userAuth = async(req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "Not Authorized! Login again"});
    }
    try {
        // decode token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
           // req.body.userId = tokenDecode.id;
            // safer: attach to req.user instead of req.body
            req.user = { id: tokenDecode.id };

        }
        else {
            return res.json({success: false, message: "Not Authorized! Login again"});
        }

        next();

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export default userAuth;