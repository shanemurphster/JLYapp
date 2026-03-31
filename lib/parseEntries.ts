/**
 * CSV parser and loader for dailyEntries.csv.
 *
 * Runs on the server only (called from Server Components via getTodayEntry).
 * Uses Node.js fs — never imported by client code.
 *
 * To add more entries: open data/dailyEntries.csv and append rows.
 * No code changes needed.
 */

import fs from "fs";
import path from "path";
import type { DailyEntry } from "@/lib/types";

// ---------------------------------------------------------------------------
// Minimal RFC-4180-compatible CSV parser
// Handles: quoted fields, escaped quotes (""), CRLF and LF line endings.
// ---------------------------------------------------------------------------

function parseCSV(raw: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (inQuotes) {
      if (ch === '"' && raw[i + 1] === '"') {
        field += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field);
        field = "";
        i++;
      } else if (ch === '\r') {
        i++; // skip CR in CRLF
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Flush the final field/row if the file doesn't end with a newline
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((f) => f.trim() !== "")) rows.push(row);
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Row → DailyEntry mapping with defensive validation
// ---------------------------------------------------------------------------

// Column order must match the CSV header:
// id, shortMessage, verseReference, verseText, reflection, action, optionalSaintOrFeast
const REQUIRED_FIELDS = ["id", "shortMessage", "verseReference", "verseText", "reflection", "action"] as const;

function rowToEntry(row: string[], lineNumber: number): DailyEntry | null {
  if (row.length < REQUIRED_FIELDS.length) {
    console.warn(`dailyEntries.csv line ${lineNumber}: skipped — only ${row.length} columns, need ${REQUIRED_FIELDS.length}`);
    return null;
  }

  const [idRaw, shortMessage, verseReference, verseText, reflection, action, saintRaw] = row;

  const id = parseInt(idRaw.trim(), 10);
  if (isNaN(id)) {
    console.warn(`dailyEntries.csv line ${lineNumber}: skipped — invalid id "${idRaw}"`);
    return null;
  }

  for (const [key, value] of [
    ["shortMessage", shortMessage],
    ["verseReference", verseReference],
    ["verseText", verseText],
    ["reflection", reflection],
    ["action", action],
  ] as const) {
    if (!value.trim()) {
      console.warn(`dailyEntries.csv line ${lineNumber}: skipped — missing required field "${key}"`);
      return null;
    }
  }

  return {
    id,
    shortMessage: shortMessage.trim(),
    verseReference: verseReference.trim(),
    verseText: verseText.trim(),
    reflection: reflection.trim(),
    action: action.trim(),
    optionalSaintOrFeast: saintRaw?.trim() || undefined,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

let _cachedEntries: DailyEntry[] | null = null;

export function loadEntriesFromCSV(): DailyEntry[] {
  // Cache in memory so multiple calls per request don't re-read disk
  if (_cachedEntries) return _cachedEntries;

  const csvPath = path.join(process.cwd(), "data", "dailyEntries.csv");
  const raw = fs.readFileSync(csvPath, "utf-8");
  const allRows = parseCSV(raw);

  // Skip the header row
  const dataRows = allRows.slice(1);

  const entries: DailyEntry[] = [];
  dataRows.forEach((row, i) => {
    const entry = rowToEntry(row, i + 2); // line 1 = header, line 2 = first data row
    if (entry) entries.push(entry);
  });

  if (entries.length === 0) {
    throw new Error(
      "dailyEntries.csv contains no valid entries. Check the file for formatting errors."
    );
  }

  _cachedEntries = entries;
  return entries;
}
