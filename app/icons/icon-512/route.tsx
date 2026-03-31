import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
        <svg width="308" height="308" viewBox="0 0 100 100" style={{ display: "block" }}>
          <path d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z" fill="#C9A96E" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
