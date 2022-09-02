import { Request } from "express";
import { UserInterface } from "../user.model";

export interface ExpressRequestInterface extends Request {
    user?: UserInterface
}