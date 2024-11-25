"use client";

import React from "react";
import Image from "next/image";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: string;
  className?: string;
  width?: number;
  height?: number;
}

export function BrandIcon({
  name,
  alt,
  width = 24,
  height = 24,
  ...rest
}: Props) {
  if (name === "outlook") {
    return (
      <Image
        src="/images/outlook.png"
        alt={alt ?? ""}
        width={width}
        height={height}
        {...rest}
      />
    );
  }

  if (name === "google") {
    return (
      <Image
        src="/images/google.svg"
        alt={alt ?? ""}
        width={width}
        height={height}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={`https://cdn.simpleicons.org/${name}`}
      alt={alt ?? ""}
      width={width}
      height={height}
      {...rest}
    />
  );
}
