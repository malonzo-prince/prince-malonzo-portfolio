import { ImageResponse } from "next/og";

export const alt = "Prince Barachiel Malonzo — Full Stack Developer, Manila, Philippines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#fafaf7",
        color: "#171b22",
        padding: "62px 72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
        }}
      >
        <div style={{ display: "flex", fontWeight: 700 }}>
          prince<span style={{ color: "#2563eb" }}>.</span>malonzo
        </div>
        <div style={{ display: "flex", fontSize: 17, color: "#5f656e" }}>MANILA, PHILIPPINES</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 82 }}>
        <div
          style={{
            display: "flex",
            color: "#2563eb",
            fontSize: 20,
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          FULL STACK DEVELOPER
        </div>
        <div style={{ display: "flex", fontWeight: 700, fontSize: 77, letterSpacing: -4 }}>
          Prince Barachiel
        </div>
        <div
          style={{
            display: "flex",
            fontWeight: 700,
            fontSize: 95,
            letterSpacing: -5,
            marginTop: -5,
          }}
        >
          Malonzo<span style={{ color: "#2563eb" }}>.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          paddingTop: 25,
          borderTop: "1px solid #d9ddd9",
          fontSize: 22,
          color: "#5f656e",
        }}
      >
        Thoughtful interfaces. Reliable systems. Built together.
      </div>
    </div>,
    size,
  );
}
