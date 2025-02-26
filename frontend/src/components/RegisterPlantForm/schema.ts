import { z } from "zod";

export const registerPlantFormSchema = z.object({
  name: z.string().nonempty("Plant name is required"),
  subtitle: z.string().nonempty("Plant subtitle is required"),
  typeId: z.string().nonempty("Plant type is required"),
  price: z
      .string()
      .nonempty("Price is required")
      .transform((value) => {
        // Remove any non-digit and dot characters, then parse as float
        const cleanValue = value.replace(/[^\d.]/g, "");
        return parseFloat(cleanValue);
      })
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Price must be a positive number",
      }),
  discount: z
      .string()
      .transform((value) => {
        // Allow empty discount (default to 0)
        if (!value.trim()) return 0;
        // Remove any non-digit and dot characters, then parse as float
        const cleanValue = value.replace(/[^\d.]/g, "");
        return parseFloat(cleanValue);
      })
      .refine((val) => !isNaN(val) && val >= 0 && val <= 100, {
        message: "Discount must be between 0 and 100",
      }),
  label: z.string().nonempty("Location is required"),
  features: z.string().nonempty("Plant features are required"),
  description: z.string().nonempty("Plant description is required"),
});