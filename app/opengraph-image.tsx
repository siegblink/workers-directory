import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#EA6400",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          Direktory
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            marginTop: 28,
            opacity: 0.88,
            letterSpacing: "0.5px",
          }}
        >
          Find &amp; Book Trusted Local Service Workers
        </div>
      </div>
    ),
    { ...size },
  );
}
