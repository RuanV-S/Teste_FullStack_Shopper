import { prisma } from "@/app/api/config/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { loginValidation } from "../validation";

export async function loginService(req: Request) {
  try {
    const body = await req.json();
    const { error } = loginValidation.validate(body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail: { message: string }) => detail.message)
        .join(", ");
      return NextResponse.json(
        { error: errorMessage },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }

    const { id, email: userEmail, createdAt } = user;

    return NextResponse.json(
      {
        user: { id, email: userEmail, createdAt },
      },
      { status: HttpStatus.OK }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no servidor", error: (error as Error).message },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
