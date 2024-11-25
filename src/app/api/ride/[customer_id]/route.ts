import { NextResponse } from "next/server";
import { getRides } from "../src/services/getRides";
import { NextApiRequest } from "next";

export async function GET(
  req: NextApiRequest,
  context: { params: { customer_id: string } }
) {
  try {
    return await getRides(req, context);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processar requisição",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
