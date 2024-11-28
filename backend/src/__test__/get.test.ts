import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "./app";

const prisma = new PrismaClient();

describe("Rides Routes", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.tripHistory.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.driver.deleteMany({});
  });

  afterEach(async () => {
    await prisma.tripHistory.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.driver.deleteMany({});
  });

  describe("GET /ride/{customer_id} Retorno esperado 200 com as corridas", () => {
    const mockGoogleMapsData = {
      origin: "1600 Amphitheatre Parkway, Mountain View, CA",
      destination: "1 Infinite Loop, Cupertino, CA",
      duration: "30 mins",
      distance: 15,
      value: 25.0,
    };

    it("Cria usuario e busca por suas viagem devendo retorna 200", async () => {
      // Preparando o banco de dados com dados de teste
      const driver = await prisma.driver.create({
        data: {
          name: "Homer Simpson",
          description:
            "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          car: "Plymouth Valiant 1973 rosa e enferrujado",
          ratePerKm: 2.5,
          minKm: 1,
        },
      });

      const user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john@teste.com",
          password: "12345678",
        },
      });

      const trip1 = await prisma.tripHistory.create({
        data: {
          destination: "2100 Amphitheatre Parkway, Mountain View, CA",
          userId: user.id,
          origin: mockGoogleMapsData.origin,
          duration: mockGoogleMapsData.duration,
          distance: mockGoogleMapsData.distance,
          driverId: driver.id,
          cost: mockGoogleMapsData.value * driver.ratePerKm,
        },
      });

      const trip2 = await prisma.tripHistory.create({
        data: {
          destination: "2100 Amphitheatre Parkway, Mountain View, CA",
          userId: user.id,
          origin: "123 Main Street, Los Angeles, CA",
          duration: "45 mins",
          distance: 20,
          driverId: driver.id,
          cost: 40.0,
        },
      });

      // Fazendo a requisição para a rota
      const response = await request(app).get(`/ride/${user.id}`);

      // Verificando os resultados
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: trip1.id,
            origin: mockGoogleMapsData.origin,
            duration: mockGoogleMapsData.duration,
            distance: mockGoogleMapsData.distance,
            cost: mockGoogleMapsData.value * driver.ratePerKm,
          }),
          expect.objectContaining({
            id: trip2.id,
            origin: "123 Main Street, Los Angeles, CA",
            duration: "45 mins",
            distance: 20,
            cost: 40.0,
          }),
        ])
      );
    });
  });

  describe("GET /ride/{customer_id}  ", () => {
    it("Deve buscar pelas corridas passando um id invalido", async () => {
      // Fazendo a requisição para a rota passando um id invalido
      const response = await request(app).get(
        `/ride/8ba571fa-ffc0-44f5-9981-a20a0b3e7f41`
      );

      // Verificando os resultados
      expect(response.status).toBe(400);
    });
  });

  describe("GET /ride/:{customer_id}", () => {
    const mockGoogleMapsData = {
      origin: "1600 Amphitheatre Parkway, Mountain View, CA",
      destination: "2100 Amphitheatre Parkway, Mountain View, CA",
      duration: "30 mins",
      distance: 15,
      value: 25.0,
    };

    it("Deve retorna uma lista com as viagem do usuario", async () => {
      const user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john@teste.com",
          password: "12345678",
        },
      });
      const driver1 = await prisma.driver.create({
        data: {
          name: "Homer Simpson",
          description:
            "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          car: "Plymouth Valiant 1973 rosa e enferrujado",
          ratePerKm: 2.5,
          minKm: 1,
        },
      });
      const driver2 = await prisma.driver.create({
        data: {
          name: "Bart Simpson",
          description:
            "Olá! Sou o Bart, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          car: "Plymouth Valiant 1973 rosa e enferrujado",
          ratePerKm: 2.5,
          minKm: 1,
        },
      });

      const trip1 = await prisma.tripHistory.create({
        data: {
          userId: user.id,
          origin: mockGoogleMapsData.origin,
          duration: mockGoogleMapsData.duration,
          destination: mockGoogleMapsData.destination,
          distance: mockGoogleMapsData.distance,
          driverId: Number(driver1.id),
          cost: mockGoogleMapsData.value,
        },
      });

      const trip2 = await prisma.tripHistory.create({
        data: {
          userId: user.id,
          destination: "2100 Amphitheatre Parkway, Mountain View, CA",
          origin: "123 Main Street, Los Angeles, CA",
          duration: "45 mins",
          distance: 20,
          driverId: Number(driver2.id),
          cost: 40.0,
        },
      });

      // Caso 1: Sem filtro
      const response1 = await request(app).get(`/ride/${user.id}`);
      expect(response1.status).toBe(200);
      expect(response1.body.length).toBe(2);

      // Caso 2: Com filtro pelo driver1
      const response2 = await request(app).get(
        `/ride/${user.id}?driver_id=${driver1.id}`
      );
      expect(response2.status).toBe(200);
      expect(response2.body.length).toBe(1);
      expect(response2.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: trip1.id,
            driverId: driver1.id,
          }),
        ])
      );

      // Caso 3: Com filtro pelo driver2
      const response3 = await request(app).get(
        `/ride/${user.id}?driver_id=${driver2.id}`
      );
      expect(response3.status).toBe(200);
      expect(response3.body.length).toBe(1);
      expect(response3.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: trip2.id,
            driverId: driver2.id,
          }),
        ])
      );
    });

    it("Deve retorna uma lista com as viagem do usuario sendo filtradas pelo motorista", async () => {
      const user = await prisma.user.create({
        data: {
          name: "Jane Doe",
          email: "teste@gmail.com",
          password: "12345678",
        },
      });
      const driver = await prisma.driver.create({
        data: {
          name: "Homer Simpson",
          description:
            "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          car: "Plymouth Valiant 1973 rosa e enferrujado",
          ratePerKm: 2.5,
          minKm: 1,
        },
      });

      // Criar uma viagem com um driver específico
      const trip = await prisma.tripHistory.create({
        data: {
          destination: "2100 Amphitheatre Parkway, Mountain View, CA",
          userId: user.id,
          origin: "123 Main Street, Los Angeles, CA",
          duration: "45 mins",
          distance: 20,
          driverId: Number(driver.id),
          cost: 40.0,
        },
      });

      // Tentar filtrar por um driver inexistente
      const response = await request(app).get(`/ride/${user.id}?driver_id=999`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Nenhuma corrida encontrada" });

      const response2 = await request(app).get(
        `/ride/${user.id}?driver_id=${driver.id}`
      );

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: trip.id,
            userId: user.id,
            origin: "123 Main Street, Los Angeles, CA",
            duration: "45 mins",
            distance: 20,
            driverId: Number(driver.id),
            cost: 40.0,
          }),
        ])
      );
    });
  });
});
