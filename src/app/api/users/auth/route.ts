import { loginService } from "../src/services/loginService";

export async function POST(req: Request) {
  return await loginService(req);
}
