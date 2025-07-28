import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./LazyImage.css";

function LazyImage({ src, alt, className }) {
  return (
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="blur"
      className={`lazy-image ${className || ""}`}
      placeholderSrc="https://placehold.co/500x750/181818/181818?text=."
    />
  );
}

export default LazyImage;
