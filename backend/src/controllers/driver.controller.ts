// controllers/driver.controller.ts
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { HttpStatus } from "../config/httpUtils";

// Função para obter motoristas
export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await prisma.driver.findMany();

    if (!drivers || drivers.length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Não contém motoristas" });
    }

    return res.status(HttpStatus.OK).json(drivers);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erro no servidor",
        error: error.message,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erro desconhecido",
      });
    }
  }
};
