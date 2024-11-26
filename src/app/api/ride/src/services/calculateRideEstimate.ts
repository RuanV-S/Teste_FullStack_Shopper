import { NextResponse } from "next/server";
import { calculateEstimation } from "../validation";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { obterCoordenadas } from "./getGeometry";
import { prisma } from "@/app/api/config/prisma";
import { obterDistance } from "./getDistanceMatrix";

export async function calculateRideEstimate(req: Request) {
  try {
    const { origin, destination, customer_id } = await req.json();

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
      return NextResponse.json(
        { error: errorMessage },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const origemCoordenadas = await obterCoordenadas(origin);
    const destinoCoordenadas = await obterCoordenadas(destination);

    if (!origemCoordenadas || !destinoCoordenadas) {
      return NextResponse.json(
        {
          message: "Erro ao consultar a API do Google Maps",
        },
        { status: HttpStatus.INTERNAL_SERVER_ERROR }
      );
    }

    const response = await obterDistance(origin, destination);

    if (!response) {
      return NextResponse.json(
        {
          message: "Erro ao consultar a API do Google Maps",
          error: response,
        },
        { status: HttpStatus.INTERNAL_SERVER_ERROR }
      );
    }

    const element = response?.rows?.[0]?.elements?.[0];

    const distancia = element?.distance?.value
      ? parseFloat((element.distance.value / 1000).toFixed(1))
      : 0;

    const duracao = element?.duration?.text || "Não disponível";

    const drivers = await prisma.driver.findMany({
      where: {
        minKm: { lte: distancia },
      },
      include: {
        reviews: true,
      },
    });

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

    return NextResponse.json(
      { message: "Operação realizada com sucesso", body },
      { status: HttpStatus.OK }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao estimar valor da corrida",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
