import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "./FormField";
import { registerPlantFormSchema } from "./schema";
import { Button } from "../Button";
import "./styles.css";
import { PlantResquest } from "../../types/plant";
import { createPlant } from "../../api/plants";
import { useState } from "react";

export function RegisterPlantForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerPlantFormSchema>>({
    resolver: zodResolver(registerPlantFormSchema),
  });

  async function onSubmit(values: z.infer<typeof registerPlantFormSchema>) {
    const {
      name,
      subtitle,
      label,
      price,
      discount,
      features,
      description,
      type,
    } = values;

    const data: PlantResquest = {
      name: name,
      subtitle: subtitle,
      label: [label, type],
      price,
      discount,
      features,
      description,
    };

    setIsLoading(true);
    createPlant(data).finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <FormField
        label="Plant name"
        name="name"
        placeholder="Echinocereus Cactus"
        register={register}
        error={errors.name}
      />

      <FormField
        label="Plant subtitle"
        name="subtitle"
        placeholder="A majestic addition to your plant collection"
        register={register}
        error={errors.subtitle}
      />

      <FormField
        label="Plant type"
        name="type"
        placeholder="Cactus"
        register={register}
        error={errors.type}
      />

      <div className="price-and-discount">
        <FormField
          label="Price"
          name="price"
          placeholder="$139.99"
          register={register}
          error={errors.price}
        />
        <FormField
          label="Discount percentage"
          name="discount"
          placeholder="20%"
          register={register}
          error={errors.discount}
        />
      </div>

      <label htmlFor="label" className="input-label inter">
        Label
      </label>
      <div className="radio-group">
        <FormField
          type="radio"
          label="Indoor"
          value="indoor"
          name="label"
          checked={true}
          register={register}
          error={errors.label}
        />
        <FormField
          type="radio"
          label="Outdoor"
          value="outdoor"
          name="label"
          register={register}
          error={errors.label}
        />
      </div>

      <FormField
        label="Features"
        name="features"
        placeholder="Species: Echinocereus..."
        textarea
        height="200px"
        register={register}
        error={errors.features}
      />

      <FormField
        label="Description"
        name="description"
        placeholder="Ladyfinger cactus..."
        textarea
        height="200px"
        register={register}
        error={errors.description}
      />

      <Button label="Register" disabled={isLoading}/>
    </form>
  );
}
