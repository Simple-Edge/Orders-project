import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../common/interfaces/express-request.interface";
import { verify } from "jsonwebtoken";
import { UserService } from "../user/user.service";
import { JWT_SECRET } from "../../config";

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_SECRET);
      const user = await this.userService.findById(decode._id);
      req.user = user;
      return next();
    } catch {
      req.user = null;
      return next();
    }
  }
}
