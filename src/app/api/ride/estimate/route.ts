import { NextRequest, NextResponse } from "next/server";
import { calculateRideEstimate } from "../src/services/calculateRideEstimate";

export async function POST(req: NextRequest) {
  try {
    return await calculateRideEstimate(req);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processa o calculo da corrida",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
