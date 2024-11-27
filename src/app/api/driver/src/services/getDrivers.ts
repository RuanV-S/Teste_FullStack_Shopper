import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { NextResponse } from "next/server";
import { prisma } from "@/app/api/config/prisma";

export async function getDrivers() {
  try {
    const drivers = await prisma.driver.findMany();

    if (!drivers || drivers.length === 0)
      return NextResponse.json(
        { message: "Não contem motoristas" },
        { status: HttpStatus.BAD_REQUEST }
      );
    return NextResponse.json(drivers, { status: HttpStatus.OK });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
