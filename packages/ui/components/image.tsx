import React from "react";
import NextImage from "next/image";
import { cn } from "@rewardkit/lib/utils";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean
};

export const Image = ({ src, alt, className, imageClassName, priority }: ImageProps) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <NextImage
        src={src}
        alt={alt}
        width={1200}
        height={700}
        className={cn("w-full h-auto", imageClassName)}
        unoptimized
        priority
      />
    </div>
  );
};