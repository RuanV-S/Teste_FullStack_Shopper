import { Request, Response } from "express";
import {
  calculateEstimation,
  getRide,
  confirmRide,
} from "../validation/ride.validation";
import { HttpStatus } from "../config/httpUtils";
import { prisma } from "../config/prisma";
import { obterCoordenadas, obterDistance } from "../services/ride.services";
// Função para obter corridas
export const getRides = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    const { error } = getRide.validate({ customer_id }, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(HttpStatus.BAD_REQUEST).json({ error: errorMessage });
    }

    const trips = await prisma.tripHistory.findMany({
      where: {
        userId: customer_id,
        driverId: driver_id ? Number(driver_id) : undefined,
      },
      include: {
        driver: true,
      },
      orderBy: {
        createdAt: "desc", // Ordena pelas corridas mais recentes
      },
    });

    // Verificando se existem corridas
    if (!trips || trips.length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Não tem viagens registradas" });
    }

    const rides = trips.map((ride) => ({
      id: ride.id,
      date: ride.createdAt,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.driver.id,
        name: ride.driver.name,
      },
      value: ride.cost,
    }));

    const body = {
      customer_id,
      rides,
    };

    return res.status(HttpStatus.OK).json(body);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Erro no servidor",
      error: (error as Error).message,
    });
  }
};

export async function calculateRideEstimate(req: Request, res: Response) {
  try {
    const { origin, destination, customer_id } = req.body;

    // Validação dos dados de entrada
    const { error } = calculateEstimation.validate(
      {
        customer_id,
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
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: errorMessage,
      });
    }

    // Obter coordenadas da origem e destino
    const origemCoordenadas = await obterCoordenadas(origin);
    const destinoCoordenadas = await obterCoordenadas(destination);

    if (!origemCoordenadas || !destinoCoordenadas) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erro ao consultar a API do Google Maps",
      });
    }

    // Obter a distância e duração via API
    const response = await obterDistance(origin, destination);

    if (!response) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erro ao consultar a API do Google Maps",
        error: response,
      });
    }

    const element = response?.rows?.[0]?.elements?.[0];

    // Calcular distância e duração
    const distancia = element?.distance?.value
      ? parseFloat((element.distance.value / 1000).toFixed(1))
      : 0;

    const duracao = element?.duration?.text || "Não disponível";

    // Buscar motoristas disponíveis
    const drivers = await prisma.driver.findMany({
      where: {
        minKm: { lte: distancia },
      },
      include: {
        reviews: true,
      },
    });

    // Mapear os motoristas disponíveis para uma lista de opções
    const driverOptions = drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      description: driver.description,
      vehicle: driver.car,
      review:
        driver.reviews.length > 0
          ? {
              rating: driver.reviews[0].rating,
              comment: driver.reviews[0].comment,
            }
          : null,
      value: driver.ratePerKm * distancia,
    }));

    // Responder com as informações da estimativa
    const body = {
      origin: {
        latitude: origemCoordenadas.lat,
        longitude: origemCoordenadas.lng,
      },
      destination: {
        latitude: destinoCoordenadas.lat,
        longitude: destinoCoordenadas.lng,
      },
      distance: distancia,
      duration: duracao,
      options: driverOptions,
      routerResponse: response,
    };

    return res.status(HttpStatus.OK).json({
      message: "Operação realizada com sucesso",
      body,
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Erro ao estimar valor da corrida",
      error: (error as Error).message,
    });
  }
}

export async function confirmationRide(req: Request, res: Response) {
  try {
    const {
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver,
      value,
    } = req.body;

    // Validação dos dados da corrida
    const { error } = confirmRide.validate(
      {
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver,
        value,
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

    // Verificar se o motorista existe
    const driverData = await prisma.driver.findUnique({
      where: {
        id: driver.id,
      },
    });

    if (!driverData)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Motorista não encontrado" });

    // Verificar se o cliente existe
    const customer = await prisma.user.findUnique({
      where: {
        id: customer_id,
      },
    });

    if (!customer)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Usuário não encontrado" });

    // Verificar se a distância é válida para o motorista
    if (driverData.minKm > distance)
      return res
        .status(HttpStatus.NOT_ACCEPTABLE)
        .json({ error: "Quilometragem inválida para o motorista" });

    // Registrar o histórico da viagem
    await prisma.tripHistory.create({
      data: {
        userId: customer_id,
        origin: origin,
        destination: destination,
        duration: duration,
        distance: distance,
        driverId: driver.id,
        cost: value,
      },
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: "Operação realizada com sucesso" });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Erro ao estimar valor da corrida",
      error: (error as Error).message,
    });
  }
}
