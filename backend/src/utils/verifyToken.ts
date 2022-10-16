import jwt from "jsonwebtoken";
import "dotenv/config";
import TokensBlackList from "../models/TokensBlackList";

const jwtSecret = process.env.JWT_SECRET;

export default async (request: any) => {
  const tokenFromHeader = request.req.headers.authorization;

  // check whether token is on a blacklist
  const isBlocked = await TokensBlackList.findOne({ token: tokenFromHeader });

  // not found or token is on blacklist
  if (!tokenFromHeader || isBlocked) return { isAuth: false };

  // token
  const token: any = tokenFromHeader.split(" ");

  // token not found
  if (!token) return { isAuth: false };

  let decodeToken: any;

  try {
    decodeToken = jwt.verify(token[1], jwtSecret);
  } catch (err) {
    return { isAuth: false };
  }

  // in case any error found
  if (!!!decodeToken) return { isAuth: false };

  // token decoded successfully, and extracted data
  return {
    isAuth: true,
    userId: decodeToken.id,
    token: tokenFromHeader,
    isAdmin: decodeToken.isAdmin,
  };
};
