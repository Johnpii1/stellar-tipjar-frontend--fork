import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stellar Tip Jar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#38bdf8",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Open Source · Stellar Network
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f8fafc",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Stellar Tip Jar
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 24,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Support creators globally with low-fee Stellar tips.
        </div>
      </div>
    ),
    size
  );
}
