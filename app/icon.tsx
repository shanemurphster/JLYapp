import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Uses a pure SVG path — no font loading required, no console warnings.
export default function Icon() {
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
          width="20"
          height="20"
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
