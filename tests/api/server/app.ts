import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Rota para listar tripHistory de um usuário específico
app.get("/api/ride/:customer_id", async (req, res) => {
  const { customer_id } = req.params;
  const { driver_id } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      id: customer_id,
    },
  });

  if (!customer_id || !user) {
    res.status(400).json({ error: "ID do usuário invalido" });
    return;
  }

  try {
    // Busca o histórico de viagens do usuário
    const tripHistories = await prisma.tripHistory.findMany({
      where: {
        userId: customer_id,
        driverId: driver_id ? Number(driver_id) : undefined,
      },
    });

    if (tripHistories.length === 0) {
      res.status(404).json({ error: "Nenhuma corrida encontrada" });
      return;
    }

    res.status(200).json(tripHistories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar trip histories" });
  }
});

export default app;
