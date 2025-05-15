import { UtilsAuthentication } from "../utils/auth.util";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils/Logger";
import { User } from "../entities/User";
import { getRepo } from "../app-source";
import Validator from "validatorjs";

class AuthController {
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
      // Check if user exists
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        res.status(400).send({ error: "Vos identifiants sont incorrects." });
        return;
      }

      // Check if password is correct
      const isPasswordValid = await UtilsAuthentication.check(
        password,
        user.password
      );

      if (!isPasswordValid) {
        res.status(400).send({ error: "Vos identifiants sont incorrects." });
        return;
      }

      // Generate JWT
      const token = UtilsAuthentication.generateToken({ email, id: user.id });

      res.status(200).send({
        user,
        token,
      });
    } catch (error) {
      const detailedError = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: (error as any).code || "UNKNOWN_ERROR",
      };

      logger.write("Authentication", logger.getContentErrorMessage(error));
      res.status(500).send({
        error: "Une erreur c'est produite, veuillez réesayer ultérieurement",
        detailedError,
      });
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    const validator = new Validator(req.body, {
      email: "required|email",
      password: "string|required",
    });

    if (validator.fails()) res.status(400).send(validator.errors.all());

    const { email, password } = req.body;
    const userRepository = getRepo(User);

    try {
      // Check if user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).send({
          error:
            "Un compte avec l'addresse email que vous avez renseigner existe déjà, veuillez vous connecté.",
        });
        return;
      }

      const user = userRepository.create({
        email,
        password: await UtilsAuthentication.hash(password),
      });

      // Save the user to the database
      await userRepository.save(user);

      res.status(201).send({
        user,
        token: UtilsAuthentication.generateToken({ email, id: user.id }),
      });
    } catch (error) {
      const detailedError = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: (error as any).code || "UNKNOWN_ERROR",
      };
      logger.write(
        "Authentication",
        detailedError.name + detailedError.message
      );
      res.status(500).send({
        error: "Une erreur c'est produite, veuillez réesayer ultérieurement",
        detailedError,
      });
    }
  }

  public async me(req: Request, res: Response): Promise<void> {
    const bearer = UtilsAuthentication.getBearerToken(req);
    if (!bearer) {
      res
        .status(400)
        .send({ error: "token invalide, veuillez vous reconnecté." });
      return;
    }

    const tokenData = UtilsAuthentication.checkToken(bearer) as JwtPayload;

    const userRepository = getRepo(User);
    const user = await userRepository.findOne({
      where: { email: tokenData.email },
    });

    res.status(200).send(user);
  }
}

export const authController = new AuthController();
