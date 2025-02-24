import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Plant } from "../../types/plant";
import { getAllPlants } from "../../api/plants";
import { NoMatch } from "./NoMatch";
import { Badge } from "../../components/Badge";

import "./styles.css";
import { Section } from "../../components/Section";
import { Button } from "../../components/Button";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();

  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    getAllPlants().then(setPlants);
  }, []);

  if (!productId || parseInt(productId) > plants.length) {
    return <NoMatch />;
  }

  const plant = plants.find((plant) => plant.id === parseInt(productId));

  if (!plant) {
    return <NoMatch />;
  }

  const discountValue = (plant.price * plant.discount) / 100;
  const discountedPrice = plant.price - discountValue;

  return (
    <div className="product-details-page">
      <Section className="product-details-page-content">
        <img
          className="product-details-page-image"
          src={plant.imageUrl}
          alt={`${plant.name} image`}
        />
        <div className="product-details-page-plant-info">
          <header className="product-details-page-plant-info-header">
            <h2 className="product-details-page-plant-title eb-garamond">
              {plant.name}
            </h2>
            <h4 className="product-details-page-plant-subtitle lato">
              {plant.subtitle}
            </h4>
          </header>
          <div className="product-details-page-plant-labels">
            {plant.label.map((label, index) => (
              <Badge key={index} title={label} />
            ))}
          </div>
          <span className="product-details-page-plant-price lato">
            {formatCurrency(discountedPrice)}
          </span>
          <Button label="Checkout" />
          <h3 className="product-details-page-section-title lato">Features</h3>
          <ul className="product-details-page-features-list">
            {plant.features.split(",").map((line, index) => (
              <li key={index} className="product-details-page-features-list-item raleway">{line}</li>
            ))}
          </ul>
          <h3 className="product-details-page-section-title lato">
            Description
          </h3>
          <p className="product-details-page-plant-description raleway">{plant.description}</p>
        </div>
      </Section>
    </div>
  );
}
