import axios from "axios";
const apiKey = process.env.GOOGLE_API_KEY;

export async function obterCoordenadas(
  endereco: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: endereco,
          key: apiKey,
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
  } catch {
    console.error("Erro ao obter coordenadas:");
    return null;
  }
}
