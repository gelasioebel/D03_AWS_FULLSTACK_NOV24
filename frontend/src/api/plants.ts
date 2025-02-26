import { api } from "../lib/api";
import { Plant, Label, PlantResponse, PlantRequest } from "../types/plant";

const defaultImage = "/images/base-plant.jpg";

/**
 * Fetches all plants from the API
 * @returns Promise with an array of plant objects
 */
export async function getAllPlants(): Promise<Plant[]> {
  try {
    const res = await api.get<PlantResponse[]>("/api/plantas");

    const { data } = res;
    console.log('Received plant data: ', data);

    // Map the API response to our frontend model
    const plants: Plant[] = data.map((plant) => {
      // Parse labels from comma-separated string
      const labels = plant.etiquetas.split(",").map(label => label.trim());
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
        typeId: plant.tipo_planta_id
      };
    });

    return plants;
  } catch (error) {
    console.error("Error fetching plants:", error);
    return [];
  }
}

/**
 * Fetches all plant types from the API
 * @returns Promise with an array of plant type objects
 */
export async function getPlantTypes() {
  try {
    const res = await api.get("/api/tipos-planta");
    return res.data;
  } catch (error) {
    console.error("Error fetching plant types:", error);
    return [];
  }
}

/**
 * Fetches a single plant by ID
 * @param id Plant ID to fetch
 * @returns Promise with the requested plant object
 */
export async function getPlantById(id: string | number): Promise<Plant | null> {
  try {
    const res = await api.get<PlantResponse>(`/api/plantas/${id}`);
    const plant = res.data;

    // Parse labels from comma-separated string
    const labels = plant.etiquetas.split(",").map(label => label.trim());
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
      typeId: plant.tipo_planta_id
    };
  } catch (error) {
    console.error(`Error fetching plant with ID ${id}:`, error);
    return null;
  }
}

/**
 * Creates a new plant
 * @param data Plant data to create
 * @returns Promise with the created plant
 */
export async function createPlant(data: PlantRequest) {
  try {
    // Combine labels into comma-separated string
    const labels = data.label.filter(Boolean).join(", ");

    // Calculate if plant is on sale based on discount
    const isSale = data.discount > 0;

    // Send data to correct endpoint with proper field mapping
    const res = await api.post("/api/plantas", {
      nome: data.name,
      subtitulo: data.subtitle,
      etiquetas: labels,
      preco: data.price,
      esta_em_promocao: isSale,
      porcentagem_desconto: data.discount > 0 ? data.discount : null,
      caracteristicas: data.features,
      descricao: data.description,
      url_imagem: data.imageUrl || defaultImage,
      tipo_planta_id: data.typeId // Use proper plant type ID
    });

    console.log("Plant created successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating plant:", error);
    throw error; // Re-throw to allow the calling component to handle the error
  }
}