import { NextRequest, NextResponse } from "next/server";
import { getMapStatic } from "./src/services/getMapStatic";

export async function POST(req: NextRequest) {
  try {
    return await getMapStatic(req);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processar a solicitação",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
