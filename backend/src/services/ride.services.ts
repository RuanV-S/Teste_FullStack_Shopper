import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.GOOGLE_API_KEY;

type DistanceMatrixResponse = {
  destination_addresses: Array<string>;
  origin_addresses: Array<string>;
  rows: Array<{
    elements: Array<{
      distance?: { value: number };
      duration?: { text: string };
      status: string;
    }>;
  }>;
  status: string;
};

export async function obterDistance(
  origin: string,
  destination: string
): Promise<DistanceMatrixResponse | null> {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: origin,
          destinations: destination,
          mode: "driving",
          language: "pt-BR",
          key: API_KEY,
        },
      }
    );

    const data = response.data;

    if (data) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("Erro ao consultar a API do Google Maps:", error);
    return null;
  }
}

export async function obterCoordenadas(
  endereco: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: endereco,
          key: API_KEY,
        },
      }
    );

    const resultado = response.data.results[0];
    if (resultado) {
      const { lat, lng } = resultado.geometry.location;
      return { lat, lng };
    }

    console.error("Endereço não encontrado:", endereco);
    return null;
  } catch (error) {
    console.error("Erro ao obter coordenadas:", error);
    return null;
  }
}
