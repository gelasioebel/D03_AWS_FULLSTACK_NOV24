import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

import { FormField } from "./FormField";
import { registerPlantFormSchema } from "./schema";
import { Button } from "../Button";
import "./styles.css";
import { PlantRequest, PlantType } from "../../types/plant";
import { createPlant, getPlantTypes } from "../../api/plants";

export function RegisterPlantForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);

    useEffect(() => {
        // Fetch plant types when component mounts
        const fetchPlantTypes = async () => {
            try {
                const types = await getPlantTypes();
                setPlantTypes(types);
            } catch (err) {
                console.error("Failed to fetch plant types:", err);
                setError("Failed to load plant types. Please try again later.");
            }
        };

        fetchPlantTypes();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof registerPlantFormSchema>>({
        resolver: zodResolver(registerPlantFormSchema),
    });

    async function onSubmit(values: z.infer<typeof registerPlantFormSchema>) {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const {
                name,
                subtitle,
                label,
                price,
                discount,
                features,
                description,
                typeId,
            } = values;

            const data: PlantRequest = {
                name,
                subtitle,
                label: [label, ""], // Using location (indoor/outdoor) as first element
                price,
                discount,
                features,
                description,
                typeId: Number(typeId), // Ensure typeId is a number
            };

            await createPlant(data);
            setSuccess(true);
            reset(); // Reset form on success
        } catch (err) {
            console.error("Error creating plant:", err);
            setError("Failed to create plant. Please check your input and try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">Plant registered successfully!</div>}

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

            <div className="form-field">
                <label htmlFor="typeId" className="input-label inter">
                    Plant type
                </label>
                <select
                    id="typeId"
                    className="form-select"
                    {...register("typeId")}
                >
                    <option value="">Select a plant type</option>
                    {plantTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.nome}
                        </option>
                    ))}
                </select>
                {errors.typeId && <span className="input-error inter">{errors.typeId.message}</span>}
            </div>

            <div className="price-and-discount">
                <FormField
                    label="Price"
                    name="price"
                    placeholder="139.99"
                    register={register}
                    error={errors.price}
                />
                <FormField
                    label="Discount percentage"
                    name="discount"
                    placeholder="20"
                    register={register}
                    error={errors.discount}
                />
            </div>

            <label htmlFor="label" className="input-label inter">
                Location
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
                placeholder="Species: Echinocereus; Light: Full sun; Water: Low"
                textarea
                height="200px"
                register={register}
                error={errors.features}
            />

            <FormField
                label="Description"
                name="description"
                placeholder="Ladyfinger cactus is a stunning addition to any collection..."
                textarea
                height="200px"
                register={register}
                error={errors.description}
            />

            <Button label={isLoading ? "Registering..." : "Register"} disabled={isLoading} />
        </form>
    );
}