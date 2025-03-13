import React, { useRef, useState, useEffect } from "react";
import CarouselItem from "./Item";
import xkcdImage from "../../../assets/images/carousel/xkcd.svg?react";
import codeSnippetImage from "../../../assets/images/carousel/code-snippet.svg?react";
import "./ItemFrame.css";

const Carousel: React.FC = () => {
  const [position, setPosition] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const speed = 1.5;

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

  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      const firstChild = containerRef.current.children[0] as HTMLElement;
      if (firstChild) {
        setItemWidth(firstChild.offsetWidth);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized || itemWidth === 0) return;

    let animationId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      setPosition((prevPosition) => {
        if (Math.abs(prevPosition) >= itemWidth) {
          return 0;
        }
        return prevPosition - speed * (deltaTime / 16);
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isInitialized, itemWidth]);

  return (
    <div className="mt-8 md:mt-14 relative overflow-hidden w-full">
      <div ref={containerRef} className="flex" style={{ transform: `translateX(${position}px)` }}>
        {carouselItems}
        {carouselItems}
      </div>
    </div>
  );
};

export default Carousel;
