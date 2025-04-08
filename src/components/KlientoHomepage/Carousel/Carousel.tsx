import React, { useRef, useState } from "react";
import CarouselItem from "./Item";
import { useCarouselAnimation } from "../../Homepage/Carousel/Scrolling";

const KlientoCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setPaused] = useState(false);

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);
  const handleClick = () => setPaused((prevState) => !prevState);
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setPaused((prevState) => !prevState);
  };

  const { position } = useCarouselAnimation(containerRef, undefined, isPaused);

  const carouselItems = (
    <div className="flex gap-8 sm:gap-16 items-center min-w-max pr-8 sm:pr-16">
      <CarouselItem workloadIdentity="your-org / your-repo" veraidIdentity="repo@example.com" />
      <CarouselItem
        workloadIdentity="k8s-api-service-account"
        veraidIdentity="api@staging.example.com"
      />
      <CarouselItem
        workloadIdentity="/subscriptions/.../userAssignedIdentities/backend"
        veraidIdentity="your-company.com"
      />
      <CarouselItem
        workloadIdentity="queue@123.iam.gserviceaccount.com"
        veraidIdentity="queue@prod.example.com"
      />
      <CarouselItem
        workloadIdentity="arn:aws:iam::12345:role/wordpress"
        veraidIdentity="blog@example.com"
      />
      <CarouselItem workloadIdentity="acme-api.vercel.app" veraidIdentity="api@acme.com" />
      <CarouselItem workloadIdentity="your-org/your-repo" veraidIdentity="repo@example.com" />
    </div>
  );

  return (
    <div
      className="mt-8 md:mt-14 relative overflow-hidden w-full bg-black"
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

export default KlientoCarousel;
