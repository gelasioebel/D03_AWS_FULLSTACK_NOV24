export type Label = ["indoor" | "outdoor", string];

export type Plant = {
  id: number;
  name: string;
  subtitle: string;
  label: Label;
  price: number;
  isSale: boolean;
  discount: number;
  features: string;
  description: string;
  imageUrl: string;
  typeId: number; // Added plant type ID
};

export type PlantResponse = {
  id: string;
  nome: string;
  subtitulo: string;
  etiquetas: string;
  preco: number;
  esta_em_promocao?: number;
  porcentagem_desconto?: number;
  caracteristicas: string;
  descricao: string;
  url_imagem: string;
  tipo_planta_id: number; // Ensure backend provides this field
  tipo_planta_nome?: string; // Optional field if backend provides it
};

export type PlantRequest = {
  name: string;
  subtitle: string;
  label: string[];
  price: number;
  discount: number;
  features: string;
  description: string;
  typeId: number; // Changed from string to number
  imageUrl?: string; // Made optional
};

export type PlantType = {
  id: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
};