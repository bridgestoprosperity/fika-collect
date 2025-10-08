import process from "process";
export const S3_BASE_URL = "https://fika-collect.s3.us-west-1.amazonaws.com";
export const MANIFEST_PATH = "surveys/manifest.json";

// API base URL - uses localhost in development, production URL otherwise
export const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : ["development", "preview"].includes(process.env.VERCEL_ENV || "")
    ? "https://staging.fikadigital.org/api/v1/"
    : "https://app.fikadigital.org/api/v1";
