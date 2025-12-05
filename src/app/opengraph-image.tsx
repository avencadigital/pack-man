import { ImageResponse } from "next/og";

// Configurações da imagem
export const runtime = "edge";
export const alt = "Pack-Man - Package Analysis Tool";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Função para gerar a imagem OG dinamicamente (opcional)
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          backgroundImage: "linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
              margin: 0,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Pack-Man
          </h1>
        </div>
        <p
          style={{
            fontSize: 32,
            color: "#cccccc",
            textAlign: "center",
            margin: 0,
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Analyze and check packages from different registries
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            gap: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            NPM
          </div>
          <div
            style={{
              backgroundColor: "#3776ab",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            PyPI
          </div>
          <div
            style={{
              backgroundColor: "#0175C2",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Pub.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
