import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { createUser } from "./src/services/createUser";

export async function POST(req: Request) {
  try {
    return await createUser(req);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
