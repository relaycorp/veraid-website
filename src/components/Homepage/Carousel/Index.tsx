import React, { useRef, useState } from "react";
import CarouselItem from "./Item";
import { useCarouselAnimation } from "./Scrolling";
import xkcdImage from "../../../assets/images/carousel/xkcd.svg?react";
import codeSnippetImage from "../../../assets/images/carousel/code-snippet.svg?react";
import "./ItemFrame.css";

const Carousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setPaused] = useState(false);

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);
  const handleClick = () => setPaused((prevState) => !prevState);
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setPaused((prevState) => !prevState);
  };

  const { position } = useCarouselAnimation(containerRef, 1.5, isPaused);

  const carouselItems = (
    <div className="flex gap-8 sm:gap-16 items-center min-w-max pr-8 sm:pr-16">
      <CarouselItem
        type="text"
        message="Developers! Developers! Developers!"
        source="sb@microsoft.com"
        bottomWidthRem={4.4}
        paddingRem={1.25}
      />
      <CarouselItem
        type="image"
        source="xkcd.com"
        imageSrc={xkcdImage}
        imageAlt="XKCD comic"
        bottomWidthRem={2.2}
        paddingRem={1}
      />
      <CarouselItem type="text" message="You shall not pass!" source="gandalf@ring.company" />
      <CarouselItem
        type="image"
        source="spotify.com"
        imageSrc="/src/assets/images/carousel/audio.gif"
        imageAlt="Audio visualization"
        bottomWidthRem={2.2}
        paddingRem={1}
      />
      <CarouselItem type="text" message="Rrrruuuurrr" source="chewbacca@kashyyyk.space" />
      <CarouselItem
        type="image"
        source="bbc.com"
        imageSrc={codeSnippetImage}
        imageAlt="BBC News"
        bottomWidthRem={4.8}
        paddingRem={1}
      />
      <CarouselItem type="text" message="Winter is coming" source="jon@nightswatch.mil" />
    </div>
  );

  return (
    <div
      className="mt-8 md:mt-14 relative overflow-hidden w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={containerRef} className="flex" style={{ transform: `translateX(${position}px)` }}>
        {carouselItems}
        {carouselItems}
      </div>
    </div>
  );
};

export default Carousel;
