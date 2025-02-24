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
  tipo_planta_nome: string;
};

export type PlantResquest = {
  name: string;
  subtitle: string;
  label: string[];
  price: number;
  discount: number;
  features: string;
  description: string;
};
