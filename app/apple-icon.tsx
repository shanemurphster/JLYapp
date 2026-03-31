import { ImageResponse } from "next/og";

export const runtime = "edge";

// 180×180 — recommended size for iPhone Retina home-screen icons
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Uses a pure SVG path — no font loading required, no console warnings.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#FAF7F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Four-pointed star drawn as a path — no font dependency */}
        <svg
          width="108"
          height="108"
          viewBox="0 0 100 100"
          style={{ display: "block" }}
        >
          <path
            d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z"
            fill="#C9A96E"
          />
        </svg>
      </div>
    ),
    size
  );
}
