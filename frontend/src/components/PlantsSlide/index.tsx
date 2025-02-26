import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Plant } from "../../types/plant";
import { PlantCard } from "../PlantCard";
import './styles.css'

type PlantsSlideProps = {
  plants: Plant[];
};

export function PlantsSlide({ plants }: PlantsSlideProps) {
  return (
    <div>
      <Swiper
        className="plants-slide"
        spaceBetween={64}
        slidesPerView={4.5}
        breakpoints={{
          240: {
            slidesPerView: 1.5,
            spaceBetween: 96,
          },

          768: {
            slidesPerView: 1.5,
            spaceBetween: 32,
          },

          1024: {
            slidesPerView: 2.5,
            spaceBetween: 96,
          },
        }}
        pagination={{ clickable: true }}
      >
        {plants.map((plant) => (
          <SwiperSlide key={plant.id}>
            <PlantCard plant={plant} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
