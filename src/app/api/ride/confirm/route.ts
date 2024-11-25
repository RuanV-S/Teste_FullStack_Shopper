import { NextRequest, NextResponse } from "next/server";
import { confirmationRide } from "../src/services/confirmRide";

export async function POST(req: NextRequest) {
  try {
    return await confirmationRide(req);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao confirma corrida",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
