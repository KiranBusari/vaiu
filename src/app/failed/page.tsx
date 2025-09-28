"use client";
import { useRouter } from "next/navigation";

export default function FailedPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "3rem 2rem",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 32px rgba(60, 60, 60, 0.15)",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        <svg
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 64 64"
          style={{
            marginBottom: 24,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <circle cx="32" cy="32" r="32" fill="#ff6b6b" />
          <path
            d="M24 24L40 40M40 24L24 40"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 style={{ color: "#222", marginBottom: 12 }}>Payment Failed!</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Unfortunately, we were unable to process your payment. Please try
          again.
        </p>
        <button
          onClick={() => router.push("/pricing")}
          style={{
            background: "linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(60, 60, 60, 0.10)",
            transition: "background 0.2s",
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
