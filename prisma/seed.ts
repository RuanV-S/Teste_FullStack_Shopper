/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando a limpeza dos dados...");

  try {
    await prisma.tripHistory.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.driver.deleteMany({});

    await prisma.driver.createMany({
      data: [
        {
          name: "Homer Simpson",
          description:
            "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          car: "Plymouth Valiant 1973 rosa e enferrujado",
          ratePerKm: 2.5,
          minKm: 1,
        },
        {
          name: "Dominic Toretto",
          description:
            "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
          car: "Dodge Charger R/T 1970 modificado",
          ratePerKm: 5.0,
          minKm: 5,
        },
        {
          name: "James Bond",
          description:
            "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
          car: "Aston Martin DB5 clássico",
          ratePerKm: 10.0,
          minKm: 10,
        },
      ],
    });

    console.log("Seed dos motorista criada com sucesso!");

    const homer = await prisma.driver.findUnique({
      where: { name: "Homer Simpson" },
    });
    const dom = await prisma.driver.findUnique({
      where: { name: "Dominic Toretto" },
    });
    const bond = await prisma.driver.findUnique({
      where: { name: "James Bond" },
    });

    // Adicionar reviews para cada driver
    await prisma.review.createMany({
      data: [
        {
          rating: 2,
          comment:
            "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
          driverId: homer ? homer.id : 1,
        },
        {
          rating: 4,
          comment:
            "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
          driverId: dom ? dom.id : 2,
        },
        {
          rating: 5,
          comment:
            "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
          driverId: bond ? bond.id : 3,
        },
      ],
    });

    console.log("Seed das review criadas");

    await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "12345678",
      },
    });

    console.log("Seed do usuario criadas");
  } catch (error) {
    console.error("Erro ao limpar os dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
