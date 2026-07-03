import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPlayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT toke not found", 401);
    }

    //Bearer
    const [, token] = authHeader.split(" ");

    const { role, sub: user_id } = jwt.verify(
      token,
      authConfig.JWT.secret,
    ) as TokenPlayload;

    request.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid JWT token", 401);
  }
}

export { ensureAuthenticated };
