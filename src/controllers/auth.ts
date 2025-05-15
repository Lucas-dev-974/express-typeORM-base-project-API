import { UtilsAuthentication } from "../utils/auth.util";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils/Logger";
import { User } from "../entities/User";
import { getRepo } from "../app-source";
import Validator from "validatorjs";

class AuthController {
  constructor() {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.me = this.me.bind(this);
  }

  private handleError(res: Response, error: any, context: string): void {
    const detailedError = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: (error as any).code || "UNKNOWN_ERROR",
    };

    logger.write(context, logger.getContentErrorMessage(error));
    res.status(500).send({
      error: "Une erreur s'est produite, veuillez réessayer ultérieurement.",
      detailedError,
    });
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  public async login(req: Request, res: Response): Promise<void> {
    const validator = new Validator(req.body, {
      email: "required|email",
      password: "string|required",
    });

    if (validator.fails()) {
      res.status(400).send(validator.errors.all());
      return;
    }

    const { email, password } = req.body;
    const userRepository = getRepo(User);

    try {
      const user = (await userRepository.findOne({ where: { email } })) as User;
      if (
        !user ||
        !(await UtilsAuthentication.check(password, user.password))
      ) {
        res.status(400).send({ error: "Vos identifiants sont incorrects." });
        return;
      }

      const token = UtilsAuthentication.generateToken({ email, id: user.id });

      res.status(200).send({
        user: this.sanitizeUser(user),
        token,
      });
    } catch (error) {
      this.handleError(res, error, "Authentication - Login");
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    const validator = new Validator(req.body, {
      email: "required|email",
      password: "string|required",
    });

    if (validator.fails()) {
      res.status(400).send(validator.errors.all());
      return;
    }

    const { email, password } = req.body;
    const userRepository = getRepo(User);

    try {
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).send({
          error:
            "Un compte avec l'adresse email que vous avez renseignée existe déjà, veuillez vous connecter.",
        });
        return;
      }

      const user = userRepository.create({
        email,
        password: await UtilsAuthentication.hash(password),
      }) as User;

      await userRepository.save(user);

      res.status(201).send({
        user: this.sanitizeUser(user),
        token: UtilsAuthentication.generateToken({ email, id: user.id }),
      });
    } catch (error) {
      this.handleError(res, error, "Authentication - Register");
    }
  }

  public async me(req: Request, res: Response): Promise<void> {
    const bearer = UtilsAuthentication.getBearerToken(req);
    if (!bearer) {
      res
        .status(400)
        .send({ error: "Token invalide, veuillez vous reconnecter." });
      return;
    }

    try {
      const tokenData = UtilsAuthentication.checkToken(bearer) as JwtPayload;
      const userRepository = getRepo(User);
      const user = (await userRepository.findOne({
        where: { email: tokenData.email },
      })) as User;

      if (!user) {
        res.status(404).send({ error: "Utilisateur non trouvé." });
        return;
      }

      res.status(200).send(this.sanitizeUser(user));
    } catch (error) {
      this.handleError(res, error, "Authentication - Me");
    }
  }
}

export const authController = new AuthController();
