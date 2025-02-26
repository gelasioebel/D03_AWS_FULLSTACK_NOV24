import { z } from "zod";
import { FieldError, UseFormRegister } from "react-hook-form";

import { registerPlantFormSchema } from "../schema";
import "./styles.css";
import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  textarea?: boolean;
  name: keyof z.infer<typeof registerPlantFormSchema>;
  register: UseFormRegister<z.infer<typeof registerPlantFormSchema>>;
  error?: FieldError;
}

export function FormField({
  type = "text",
  height,
  label,
  placeholder,
  textarea,
  checked,
  value,
  name,
  register,
  error,
}: FormFieldProps) {
  return (
    <>
      <div
        className={
          type === "radio" ? "input-group-horizontal" : "input-group-vertical"
        }
      >
        <label
          htmlFor={name}
          className={`${type !== "radio" && "input-label"} inter`}
        >
          {label}
        </label>
        <div className="input-container">
          {textarea ? (
            <textarea
              {...register(name)}
              placeholder={placeholder}
              defaultChecked={checked}
              defaultValue={type === "radio" ? value : ""}
              style={{
                height: height,
              }}
            ></textarea>
          ) : (
            <input
              type={type}
              {...register(name)}
              placeholder={placeholder}
              defaultChecked={checked}
              defaultValue={type === "radio" ? value : ""}
              style={{
                height: height,
              }}
            />
          )}
        </div>
      {error && <span className="input-error inter">{error.message}</span>}
      </div>
    </>
  );
}
