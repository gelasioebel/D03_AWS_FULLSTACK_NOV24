import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles - these will be handled by the CSS declaration file
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// Import Swiper modules
import { Pagination } from "swiper/modules";

import { Plant } from "../../types/plant";
import { PlantCard } from "../PlantCard";
import "./styles.css";

type PlantsSlideProps = {
    plants: Plant[];
};

export function PlantsSlide({ plants }: PlantsSlideProps) {
    if (plants.length === 0) {
        return <div className="plants-slide-empty">No plants available</div>;
    }

    return (
        <div className="plants-slide-container">
            <Swiper
                className="plants-slide"
                spaceBetween={64}
                slidesPerView={4.5}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                breakpoints={{
                    240: {
                        slidesPerView: 1.5,
                        spaceBetween: 16,
                    },
                    640: {
                        slidesPerView: 1.5,
                        spaceBetween: 32,
                    },
                    768: {
                        slidesPerView: 2.5,
                        spaceBetween: 32,
                    },
                    1024: {
                        slidesPerView: 3.5,
                        spaceBetween: 48,
                    },
                    1280: {
                        slidesPerView: 4.5,
                        spaceBetween: 64,
                    },
                }}
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