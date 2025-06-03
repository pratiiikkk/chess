import React from "react";

export default function BackgroundGradients() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Top Right Gradient */}
      <div
        className="absolute -top-[55%] -right-[30%] h-[100%] w-[60%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
        }}
      ></div>

      {/* Bottom-left radial gradient */}
      <div
        className="absolute -bottom-[60%] -left-[30%] h-[100%] w-[70%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
        }}
      ></div>
    </div>
  );
}
