import { Droplet, ShoppingBag, Sun } from "lucide-react";

import { Button } from "../../../components/Button";
import { Section } from "../../../components/Section";
import { StepCard, StepCardProps } from "../../../components/StepCard";

import "./styles.css";

const cards: StepCardProps[] = [
  {
    icon: Droplet,
    title: "Watering",
    description:
      "water your plants when the top inch of soil feels dry to the touch. Avoid overwatering, as it can lead to root  dehydration.",
  },
  {
    icon: Sun,
    title: "Sunlight",
    description:
      "Most plants need adequate sunlight to thrive. Place your plants in areas that receive the appropriate amount of light for their specific needs",
  },
  {
    icon: ShoppingBag,
    title: "Nutrients and Fertilizing",
    description:
      "Choose a suitable fertilizer based on the specific needs of your plants, whether it's a balanced or specialized formula.",
  },
];

export function StepsSection() {
  return (
    <Section className="steps-section">
      <header className="steps-heading">
        <h2 className="eb-garamond">
          steps to take care of your <span className="text-green">plants</span>
        </h2>
        <p className="raleway">
          By following these three steps - proper watering, appropriate
          sunlight, and providing essential nutrients - you'll be well on your
          way to maintaining healthy and thriving plants.
        </p>
      </header>
      <div className="step-list">
        {cards.map((card, index) => (
          <StepCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
      <div className="steps-gallery">
        <img className="gallery-column" src="/images/gallery-1.png" alt="" />
        <img className="gallery-column" src="/images/gallery-2.png" alt="" />
        <div className="gallery-column">
          <img src="/images/gallery-3.png" alt="" />
          <p className="gallery-text raleway">
            Our website offers a wide array of stunning plants, ranging from
            vibrant flowers to lush indoor foliage, allowing you to create your
            very own green oasis. In addition to our extensive plant selection,
            we also provide gardening kits and fertilizers to equip you with
            everything you need to nurture your plants and achieve gardening
            success. But we don't stop there! We believe that knowledge is the
            key to a thriving garden, so we offer a wealth of information and
            resources on gardening techniques, plant care tips, and landscaping
            ideas. Whether you're a seasoned gardener or just starting your
            green journey, our goal is to inspire and support you every step of
            the way. Get ready to explore our virtual garden and discover the
            joys of gardening with us!
          </p>
          <Button label="See more photos" />
        </div>
      </div>
    </Section>
  );
}
