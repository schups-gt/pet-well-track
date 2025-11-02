import { useState, useEffect } from "react";
import foto1 from "../assets/foto 1.jpg";
import foto2 from "../assets/foto 2.jpg";
import foto3 from "../assets/foto 3.jpg";

const images = [foto1, foto2, foto3];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // muda a cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card min-h-[400px]">
      {/* 1. Viewport do Carrossel (Onde a mágica acontece) */}
      <div 
        className="flex transition-transform ease-in-out duration-700 h-full"
        // Move o contêiner horizontalmente baseado na imagem atual
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {/* 2. Mapeamento das Imagens */}
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Slide ${i + 1}`}
            // Importante: flex-none e w-full garantem que cada imagem ocupe exatamente 100% da largura
            className="flex-none w-full h-full object-cover" 
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
