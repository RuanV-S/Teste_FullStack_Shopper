import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  createUserValidation,
  loginValidation,
} from "../validation/user.validation";
import { HttpStatus } from "../config/httpUtils";
import { prisma } from "../config/prisma";

export async function createUser(req: Request, res: Response) {
  try {
    const body = req.body;

    const { error } = createUserValidation.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: { message: string }) => detail.message)
        .join(", ");
      return res.status(HttpStatus.BAD_REQUEST).json({ error: errorMessage });
    }

    const { name, email, password } = body;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Retornar o usuário criado
    return res.status(HttpStatus.CREATED).json(user);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Erro no servidor",
      error: (error as Error).message,
    });
  }
}

export async function loginService(req: Request, res: Response) {
  try {
    const body = req.body; // Para Express, usamos req.body
    const { error } = loginValidation.validate(body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail: { message: string }) => detail.message)
        .join(", ");
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: errorMessage,
      });
    }

    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Credenciais inválidas",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Credenciais inválidas",
      });
    }

    const { id, email: userEmail, createdAt } = user;

    return res.status(HttpStatus.OK).json({
      user: { id, email: userEmail, createdAt },
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Erro no servidor",
      error: (error as Error).message,
    });
  }
}
