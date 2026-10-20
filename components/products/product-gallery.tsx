"use client";

import Image from "next/image";
import { useState } from "react";
import type { PreviewProductImage } from "@/lib/content/catalog-preview";

export function ProductGallery({ images, productName }: { images: readonly PreviewProductImage[]; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return (
      <figure className="product-detail-placeholder" role="img" aria-label={`Approved product photography for ${productName} is pending`}>
        <span className="product-detail-placeholder__mark" aria-hidden="true">AN</span>
        <figcaption>Approved product photography pending</figcaption>
      </figure>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="(max-width: 760px) 100vw, 48vw" priority />
      </div>
      {images.length > 1 ? (
        <div className="product-gallery__thumbnails" aria-label={`${productName} image selection`}>
          {images.map((image, index) => (
            <button key={image.src} type="button" aria-label={`Show image ${index + 1} of ${images.length}`} aria-pressed={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
              <Image src={image.src} alt="" fill sizes="72px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
