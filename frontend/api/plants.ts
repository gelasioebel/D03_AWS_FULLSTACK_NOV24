import { api } from "../lib/api";
import { Plant, Label, PlantResponse, PlantResquest } from "../types/plant";

const defaultImage = "/images/base-plant.jpg";

export async function getAllPlants(): Promise<Plant[]> {
  try {
    const res = await api.get<PlantResponse[]>("/api/plantas");

    
    const { data } = res;
    console.log('Data: ', data)
    
    const plants: Plant[] = data.map((plant) => {
      const labels = plant.etiquetas.split(",");
      const label: Label = [
        (labels[0] as "indoor" | "outdoor") || "indoor",
        labels[1] || "",
      ];

      return {
        id: parseInt(plant.id),
        name: plant.nome,
        subtitle: plant.subtitulo,
        description: plant.descricao,
        price: plant.preco,
        isSale: Boolean(plant.esta_em_promocao),
        discount: plant.porcentagem_desconto || 0,
        imageUrl: plant.url_imagem || defaultImage,
        features: plant.caracteristicas,
        label: label,
      };
    });

    return plants;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createPlant(data: PlantResquest) {
  const labels = data.label.join(", ");

  const discountValue = (data.price * data.discount) / 100;
  const discountedPrice = data.price - discountValue;

  const isSale = discountedPrice < data.price;
  console.log({
    isSale,
    data,
  });

  const res = await api.post("/api/adicionarPlantas", {
    nome: data.name,
    subtitulo: data.subtitle,
    etiquetas: labels,
    preco: data.price,
    esta_em_promocao: isSale,
    porcentagem_desconto: data.discount,
    caracteristicas: data.features,
    descricao: data.description,
    url_imagem: defaultImage,
    tipo_planta_id: data.name,
  });

  console.log("Response: ", res);
}
