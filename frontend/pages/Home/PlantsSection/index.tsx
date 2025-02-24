import { useEffect, useState } from "react";

import { Plant } from "../../../types/plant";
import { getAllPlants } from "../../../api/plants";
import { PlantsSlide } from "../../../components/PlantsSlide";
import "./styles.css";

export function PlantsSection() {
  const [plants, setPlants] = useState<Plant[]>([]);
  
  useEffect(() => {
    getAllPlants().then(setPlants);
  }, []);

  const inSalesPlants = plants.filter((plant) => plant.isSale);

  return (
    <section className="plants-section">
      <header className="plants-header">
        <h1 className="plants-title eb-garamond">
          this weeks Most Popular{" "}
          <span className="text-green">and best selling</span>
        </h1>
      </header>
      <main className="plants-content">
        <PlantsSlide plants={plants} />
      </main>

      <header className="plants-header">
        <h1 className="plants-title eb-garamond">
          <span className="text-green">Plants in</span> Sale
        </h1>
      </header>
      <main className="plants-content">
        <PlantsSlide plants={inSalesPlants} />
      </main>
    </section>
  );
}
