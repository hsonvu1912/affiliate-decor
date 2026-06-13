import { driveClient } from "@/lib/google/auth";

export interface DriveFile {
  buffer: Buffer;
  contentType: string;
}

/** Fetch raw bytes of a Drive file by ID (used by the /img proxy). */
export async function fetchDriveFile(fileId: string): Promise<DriveFile> {
  const drive = driveClient();
  const res = await drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    { responseType: "arraybuffer" },
  );
  const contentType =
    (res.headers as Record<string, string>)["content-type"] ?? "application/octet-stream";
  return { buffer: Buffer.from(res.data as ArrayBuffer), contentType };
}
