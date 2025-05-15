import { Request, Response, NextFunction } from "express";
import { UtilsAuthentication } from "../utils/auth.util";
import _public from "../routes/public";

export class JWTMiddleware {
  static checkBearerToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    if (JWTMiddleware.isPublic(req.method, req.path)) return next();

    const token = UtilsAuthentication.getBearerToken(req);
    const user = UtilsAuthentication.checkToken(token);

    if (typeof user == "object") {
      res.locals.user = user;
      return next();
    } else return res.status(401).json("Accès non autorisé.");
  }

  static isPublic(method: string, path: string) {
    return _public.some(
      (route) => route.method == method && route.path.includes(path)
    );
  }
}
