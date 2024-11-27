import { NextResponse } from "next/server";
import { getDrivers } from "./src/services/getDrivers";

export async function GET() {
  try {
    return await getDrivers();
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao buscar por motoristas",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
