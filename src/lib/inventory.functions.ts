import { createServerFn } from "@tanstack/react-start";

const SPREADSHEET_ID = "1ORzOL7KHGoEAHXAXBdOG7Hs1ez5saOjxS2MDNbM1uUU";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

export type Bike = {
  bike_id: string;
  brand: string;
  model: string;
  year: string;
  price: number | null;
  mileage: number | null;
  engine: string;
  registration: string;
  color: string;
  condition: string;
  ownership: string;
  papers: string;
  description: string;
  status: string;
  featured: boolean;
  whatsapp: string;
  images: string[];
};

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

type InventoryResult = { bikes: Bike[]; fetchedAt: string; stale?: boolean };

// Sheets enforces a per-minute read quota, so cache the last good response and
// reuse it both for fresh calls within the TTL and as a fallback on 429/5xx.
const CACHE_TTL_MS = 60_000;
let cache: { data: InventoryResult; at: number } | undefined;

export const getInventory = createServerFn({ method: "GET" }).handler(
  async (): Promise<InventoryResult> => {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;

    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!lovableKey || !connectionKey) {
      throw new Error("Google Sheets connection is not configured.");
    }

    const url = new URL(`${GATEWAY}/spreadsheets/${SPREADSHEET_ID}/values:batchGet`);
    url.searchParams.append("ranges", "Inventory!A1:R500");
    url.searchParams.append("ranges", "Photos!A1:Z500");
    url.searchParams.set("valueRenderOption", "UNFORMATTED_VALUE");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Sheets request failed [${res.status}]: ${body}`);
      // Rate limit / upstream hiccup: serve the last known inventory instead of
      // failing the page. Only a genuine config/permission error surfaces.
      if (cache && (res.status === 429 || res.status >= 500)) {
        return { ...cache.data, stale: true };
      }
      if (res.status === 429) {
        return { bikes: [], fetchedAt: new Date().toISOString(), stale: true };
      }
      throw new Error(`Sheets request failed [${res.status}]: ${body}`);
    }

    const json = (await res.json()) as {
      valueRanges?: { values?: unknown[][] }[];
    };

    const inventoryRows = json.valueRanges?.[0]?.values ?? [];
    const photoRows = json.valueRanges?.[1]?.values ?? [];

    const headers = (inventoryRows[0] ?? []).map((h) => String(h ?? "").trim().toLowerCase());
    const col = (row: unknown[], name: string) => {
      const i = headers.indexOf(name);
      return i === -1 ? "" : String(row[i] ?? "").trim();
    };

    const photoMap = new Map<string, string[]>();
    for (const row of photoRows.slice(1)) {
      const id = String(row[0] ?? "").trim();
      if (!id) continue;
      const urls = row
        .slice(1)
        .map((c) => String(c ?? "").trim())
        .filter((c) => c.startsWith("http"));
      photoMap.set(id, urls);
    }

    const bikes: Bike[] = inventoryRows
      .slice(1)
      .filter((row) => String(row[0] ?? "").trim() !== "")
      .map((row) => {
        const id = col(row, "bike_id");
        const main = col(row, "main_image");
        const gallery = photoMap.get(id) ?? [];
        return {
          bike_id: id,
          brand: col(row, "brand"),
          model: col(row, "model"),
          year: col(row, "year"),
          price: toNumber(col(row, "price")),
          mileage: toNumber(col(row, "mileage")),
          engine: col(row, "engine"),
          registration: col(row, "registration"),
          color: col(row, "color"),
          condition: col(row, "condition"),
          ownership: col(row, "ownership"),
          papers: col(row, "papers"),
          description: col(row, "description"),
          status: col(row, "status") || "Available",
          featured: col(row, "featured").toLowerCase() === "yes",
          whatsapp: col(row, "whatsapp"),
          images: [main, ...gallery].filter((u) => u.startsWith("http")),
        };
      });

    return { bikes, fetchedAt: new Date().toISOString() };
  },
);
