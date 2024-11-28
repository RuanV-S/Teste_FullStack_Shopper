import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { NextResponse } from "next/server";
import { getRide } from "../validation";
import { prisma } from "@/app/api/config/prisma";

export async function getRides(
  req: Request,
  { params }: { params: { customer_id: string } }
) {
  try {
    const customer_id = params.customer_id;

    const url = new URL(req.url);
    const driver_id = url.searchParams.get("driver_id");

    const { error } = getRide.validate(
      {
        customer_id,
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

    if (!trips || trips.length === 0)
      return NextResponse.json(
        { message: "Motorista invalido" },
        { status: HttpStatus.BAD_REQUEST }
      );

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

    return NextResponse.json(body, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
