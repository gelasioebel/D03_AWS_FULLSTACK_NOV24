import { z } from "zod";

export const registerPlantFormSchema = z.object({
  name: z.string().nonempty("Plant name is required"),
  subtitle: z.string().nonempty("Plant subtitle is required"),
  type: z.string().nonempty("Plant type is required"),
  price: z
    .string().nonempty("Price is required")
    .transform((value) => parseFloat(value.replace(/[^\d.]/g, ""))),
  discount: z
    .string().nonempty("Discount is required")
    .transform((value) => parseFloat(value.replace(/[^\d.]/g, ""))),
  label: z.string(),
  features: z.string().nonempty("Plant features is required"),
  description: z.string().nonempty("Plant description is required"),
});
