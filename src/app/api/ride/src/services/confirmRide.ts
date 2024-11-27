import { NextResponse } from "next/server";
import { confirmRide } from "../validation";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { prisma } from "@/app/api/config/prisma";

export async function confirmationRide(req: Request) {
  try {
    const {
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver,
      value,
    } = await req.json();

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
      return NextResponse.json(
        { error: errorMessage },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const driverData = await prisma.driver.findUnique({
      where: {
        id: driver.id,
      },
    });

    if (!driverData)
      return NextResponse.json(
        { error: "Motorista não encontrado" },
        { status: HttpStatus.NOT_FOUND }
      );

    const customer = await prisma.user.findUnique({
      where: {
        id: customer_id,
      },
    });

    if (!customer)
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: HttpStatus.NOT_FOUND }
      );

    if (driverData.minKm > distance)
      return NextResponse.json(
        { error: "Quilometragem inválida para o motorista " },
        { status: HttpStatus.NOT_ACCEPTABLE }
      );

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

    return NextResponse.json(
      { message: "Operação realizada com sucesso" },
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
