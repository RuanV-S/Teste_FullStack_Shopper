import { Request, Response } from "express";
import { MapStatic } from "../validation/mapStatic.validation";
import { HttpStatus } from "../config/httpUtils";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

export const getMapStatic = async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.body;

    // Validação dos dados
    const { error } = MapStatic.validate(
      {
        origin,
        destination,
      },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(HttpStatus.BAD_REQUEST).json({ error: errorMessage });
    }

    const url = `https://maps.googleapis.com/maps/api/staticmap?size=1200x800&markers=color:green|label:A|${origin}&markers=color:red|label:B|${destination}&key=${apiKey}`;

    return res
      .status(HttpStatus.OK)
      .json({ message: "Operação realizada com sucesso", url });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Erro ao gerar mapa estático",
      error: (error as Error).message,
    });
  }
};
