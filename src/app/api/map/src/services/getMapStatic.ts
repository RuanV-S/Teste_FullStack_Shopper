import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { NextResponse } from "next/server";
import { MapStatic } from "../validation";
const apiKey = process.env.GOOGLE_API_KEY;

export async function getMapStatic(req: Request) {
  try {
    const { origin, destination } = await req.json();

    const { error } = MapStatic.validate(
      {
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

    const url = `https://maps.googleapis.com/maps/api/staticmap?size=1200x800&markers=color:green|label:A|${origin}&markers=color:red|label:B|${destination}&key=${apiKey}`;

    return NextResponse.json(
      { message: "Operação realizada com sucesso", url },
      { status: HttpStatus.OK }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao gerar mapa estatico",
        error: (error as Error).message,
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
