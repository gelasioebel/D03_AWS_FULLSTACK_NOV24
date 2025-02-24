import { RegisterPlantForm } from "../../components/RegisterPlantForm";
import "./styles.css";

export default function Register() {
  return (
    <div className="register-page">
      <div className="form-section">
        <h2 className="register-title inter">Plant registration</h2>
        <RegisterPlantForm />
      </div>
      <img
        className="register-plant"
        src="/images/main-plant.png"
        alt="Main plant"
      />
    </div>
  );
}
