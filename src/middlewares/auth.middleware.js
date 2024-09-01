import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = jwt.sign({ id: "user123" }, process.env.ACCESS_TOKEN_SECRET);
    // console.log("Generated Token:", gtoken);

    // const token =
    //   req.cookies?.accessToken ||
    //   req.header("Authorization")?.replace("Bearer ", "");

    console.log("token ", token);
    console.log("token ", process.env.ACCESS_TOKEN_SECRET);

    if (!token) {
      throw new ApiError(401, "Unathorized token");
    }

    // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded : ", decodedToken);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("jwt error : ", error);
    throw new ApiError(401, error?.message || "Invalid AccessToken");
  }
});
