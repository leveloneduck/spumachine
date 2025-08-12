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
  // Default to an existing public asset so you can immediately see the frame.
  // Replace with your border file (e.g., "/border-frame.png") or use ?frameSrc=/your-file.png
  src = "/PRESS HERE.png",
  slice = 256,
  size = "clamp(12px, 3vw, 48px)",
  repeat = "round",
}) => {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : undefined;
  const finalSrc = (params?.get("frameSrc") || src).toString();
  const finalSlice = params?.get("frameSlice") ? Number(params.get("frameSlice")) : slice;
  const finalSize = params?.get("frameSize") || size;
  const finalRepeat = (params?.get("frameRepeat") as "stretch" | "round" | "repeat") || repeat;
  const mode = (params?.get("frameMode") as "image" | "strips") || "strips";
  const thickness = params?.get("frameThickness") || "clamp(28px, 5vw, 120px)";
  const rotateSides = params?.get("frameRotateSides") ? params.get("frameRotateSides") === "true" : true;

  return (
    mode === "image" ? (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          boxSizing: "border-box",
          // Draw a frame using the provided image
          borderStyle: "solid",
          borderWidth: finalSize,
          borderColor: "transparent", // Hide solid border if image fails to load
          borderImageSource: `url("${finalSrc}")`,
          borderImageSlice: finalSlice,
          borderImageWidth: 1,
          borderImageOutset: 0,
          borderImageRepeat: finalRepeat,
        }}
      />
    ) : (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
        <div style={{ position: "absolute", inset: 0 }}>
          {/* Top strip */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: thickness,
              backgroundImage: `url("${finalSrc}")`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
            }}
          />
          {/* Bottom strip */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: thickness,
              backgroundImage: `url("${finalSrc}")`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
              transform: "scaleY(-1)",
            }}
          />
          {/* Left strip */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: thickness,
              backgroundImage: `url("${finalSrc}")`,
              backgroundRepeat: "repeat-y",
              backgroundSize: rotateSides ? "auto 100%" : "100% auto",
            }}
          />
          {/* Right strip */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: thickness,
              backgroundImage: `url("${finalSrc}")`,
              backgroundRepeat: "repeat-y",
              backgroundSize: rotateSides ? "auto 100%" : "100% auto",
              transform: "scaleX(-1)",
            }}
          />
        </div>
      </div>
    )
  );
};

export default PageFrame;
