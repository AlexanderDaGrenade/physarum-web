import { ImageResponse } from "next/og";
import { LOGO_VIEWBOX, MARK_PATH, WORD_PATH } from "@/components/brand/logo-paths";

export const dynamic = "force-static";
export const alt = "Physarum — Intelligence that navigates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>
        <svg viewBox={LOGO_VIEWBOX} width={760} height={182}>
          <path d={MARK_PATH} fill="#F5C518" />
          <path d={WORD_PATH} fill="#fff" />
        </svg>
        <div style={{ color: "#9a9a9a", fontSize: 40 }}>Intelligence that navigates</div>
      </div>
    ),
    size,
  );
}
