import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  const token = getTokenFromHeader(req)
  if(!token){
    return res.status(401).json({ error: "Token is missing" });
  }
  const decodedUser = verifyToken(token)

  if(!decodedUser){
    return res.status(401).json({ error: "Unauthorized" });
  }else{

    next()
  }
}