import React from "react";

interface PageFrameProps {
  /**
   * Path to the border image. Place your image in the public folder and pass its path, e.g. "/border-frame.png".
   */
  src?: string;
  /**
   * Border image slice value (in CSS pixels of the source image). Adjust to match your frame's border thickness.
   */
  slice?: number;
  /**
   * CSS size for the visible border thickness around the viewport. Responsive by default.
   */
  size?: string;
  /**
   * How the border image is repeated. Usually "stretch", sometimes "round" looks better for patterned frames.
   */
  repeat?: "stretch" | "round" | "repeat";
}

/**
 * Full-viewport decorative frame using CSS border-image.
 * This sits above the app UI but does not intercept pointer events.
 */
const PageFrame: React.FC<PageFrameProps> = ({
  src = "/border-frame.png",
  slice = 256,
  size = "clamp(12px, 3vw, 48px)",
  repeat = "stretch",
}) => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        boxSizing: "border-box",
        // Draw a frame using the provided image
        borderStyle: "solid",
        borderWidth: size,
        borderColor: "transparent", // Hide solid border if image fails to load
        borderImageSource: `url(${src})`,
        borderImageSlice: slice,
        borderImageWidth: 1,
        borderImageOutset: 0,
        borderImageRepeat: repeat,
      }}
    />
  );
};

export default PageFrame;
