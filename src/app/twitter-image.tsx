import Logo from "@/components/Common/Logo";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt =
  "Quick Chess! \nHere's a simple quick chess game to have fun with";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font
  const interSemiBold = fetch(
    new URL("@/assets/fonts/Pistilli-Roman.otf", import.meta.url),
  ).then(res => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          gap: 12,
          background: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo
          style={{
            width: 256,
            height: 256,
          }}
        />
        <h1
          style={{
            color: "white",
            fontSize: 64,
          }}
        >
          Quick Chess
        </h1>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
