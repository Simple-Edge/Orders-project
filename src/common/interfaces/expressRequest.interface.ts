import { Request } from "express";
import { UserInterface } from "../models/user.model";

export interface ExpressRequestInterface extends Request {
  user?: UserInterface;
}
