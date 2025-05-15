import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request } from "express";
import bcrypt from "bcrypt";

export type UserTokenInformationType = {
  email: string;
  id: number;
};

export class UtilsAuthentication {
  static saltRound = 10;
  static secret = process.env.JWT_PRIVATE as string;

  static async hash(password: string) {
    return await bcrypt.hash(password, this.saltRound);
  }

  static async check(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: UserTokenInformationType) {
    return jwt.sign(user, this.secret, { expiresIn: "1h" });
  }

  static checkToken(token: string) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return "Token expiré, veuillez vous reconnecter.";
      }
      return false;
    }
  }

  static getBearerToken(req: Request): string {
    return req.headers.authorization?.split(" ")[1] ?? "";
  }

  static async generateRandomNumber(repo: any): Promise<number> {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const entityExist = await repo.findOneBy({ id: randomNumber });
    if (entityExist) {
      return this.generateRandomNumber(repo);
    }
    return randomNumber;
  }
}
