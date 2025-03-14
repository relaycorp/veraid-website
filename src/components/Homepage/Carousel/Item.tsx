import React from "react";
import TickIcon from "../../../assets/icons/tick.svg?react";
import "./ItemFrame.css";

interface BaseItem {
  type: string;
  source: string;
  bottomWidthRem?: number;
  paddingRem?: number;
}

interface TextItem extends BaseItem {
  type: "text";
  message: string;
}

interface ImageItem extends BaseItem {
  type: "image";
  imageSrc: React.ComponentType<React.SVGProps<SVGSVGElement>> | { src: string } | string;
  imageAlt: string;
}

type CarouselItemProps = TextItem | ImageItem;

const CarouselItem: React.FC<CarouselItemProps> = ({
  type,
  source,
  bottomWidthRem = 1.75,
  paddingRem = 2.5,
  ...rest
}) => {
  const message = type === "text" ? (rest as TextItem).message : "";
  const imageSrc = type === "image" ? (rest as ImageItem).imageSrc : "";
  const imageAlt = type === "image" ? (rest as ImageItem).imageAlt : "";

  const renderImage = () => {
    if (!imageSrc) return null;

    if (typeof imageSrc === "function") {
      const ImageComponent = imageSrc;
      return (
        <div className="py-1">
          <ImageComponent aria-label={imageAlt} />
        </div>
      );
    }

    const src = typeof imageSrc === "string" ? imageSrc : (imageSrc as { src: string }).src;

    return (
      <div className="py-1">
        <img
          src={src}
          alt={imageAlt}
          className="max-w-full h-auto"
          onError={(e) => console.error("Image failed to load:", e)}
        />
      </div>
    );
  };

  return (
    <div className="relative pb-3">
      <div
        className="pixelated-frame pt-3 text-center mx-auto bg-black text-white font-mono font-normal text-xs lg:text-sm"
        style={
          {
            "--bottom-segment-width": `${bottomWidthRem}rem`,
            paddingLeft: `${paddingRem}rem`,
            paddingRight: `${paddingRem}rem`,
          } as React.CSSProperties
        }
      >
        <div className="frame-part top-bar"></div>
        <div className="frame-part top-right-corner"></div>
        <div className="frame-part bottom-right-corner"></div>
        <div className="frame-part bottom-left-segment"></div>
        <div className="frame-part bottom-right-segment"></div>
        <div className="frame-part bottom-left-corner"></div>
        <div className="frame-part top-left-corner"></div>
        <div className="frame-part left-bar"></div>
        <div className="frame-part right-bar"></div>

        {type === "image" && renderImage()}

        <p>{message}</p>
        <div className="flex items-center justify-center translate-y-2">
          <span>{source}</span>
          <TickIcon className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
