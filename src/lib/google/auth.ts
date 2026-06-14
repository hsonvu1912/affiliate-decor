import { google } from "googleapis";
import { requireGoogleEnv } from "@/lib/env";

// A single JWT-authenticated client shared across Sheets + Drive. Built lazily
// so importing this module never fails when running on mock data.

let cachedAuth: InstanceType<typeof google.auth.JWT> | null = null;

function getAuth() {
  if (cachedAuth) return cachedAuth;
  const { email, privateKey } = requireGoogleEnv();
  cachedAuth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets", // read + append Clicks
      "https://www.googleapis.com/auth/drive.readonly", // image proxy
    ],
  });
  return cachedAuth;
}

export function sheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

export function driveClient() {
  return google.drive({ version: "v3", auth: getAuth() });
}
