export type TableArray = Array<Array<string>>;

export type ParsedTransaction = {
  merchant: string;
  amount: number;
  date: string;
};

const MONTH_MAP: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const DATE_PATTERNS = [
  /\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b/,
  /\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/,
  /\b(\d{1,2})[.\s](\d{1,2})[.\s](\d{2,4})\b/,
  /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[,\s]+(\d{2,4})\b/i,
  /\b(\d{1,2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*-(\d{2,4})\b/i,
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})[,\s]+(\d{2,4})\b/i,
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*-(\d{1,2})-(\d{2,4})\b/i,
  /\b(\d{1,2})(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\d{2,4})\b/i,
];

const AMOUNT_PATTERN =
  /(?:₹|Rs\.?|INR|\$|USD|EUR|GBP)?\s*\(?-?\d{1,3}(?:,\d{2,3})*(?:\.\d{1,2})?\)?(?:\s*(?:Dr|CR|dr|cr))?/g;

const SKIP_LINE =
  /\b(opening|closing)\s*balance\b|\bstatement\s+(?:period|date)\b|\bpage\s+\d+\s+of\b|\btotal\s+(?:debit|credit|amount)\b|\bavailable\s+(?:limit|balance)\b|\bminimum\s+amount\s+due\b|\bpayment\s+due\b|\bprevious\s+balance\b/i;

const HEADER_HINT =
  /\b(date|txn|transaction|posting|value)\s*date\b|\bdescription\b|\bparticulars\b|\bnarration\b|\bmerchant\b|\bdebit\b|\bcredit\b|\bamount\b/i;

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/([a-z])-\n([a-z])/gi, "$1$2")
    .replace(/\n{3,}/g, "\n\n");
}

export function parseDateFromText(val: string): string {
  const s = String(val).trim();
  if (!s) return "";

  for (const pattern of DATE_PATTERNS) {
    const match = s.match(pattern);
    if (!match) continue;

    let year: number;
    let month: number;
    let day: number;

    if (/^\d{4}$/.test(match[1])) {
      year = Number(match[1]);
      month = Number(match[2]);
      day = Number(match[3]);
    } else if (/^[A-Za-z]/.test(match[1])) {
      month = MONTH_MAP[match[1].slice(0, 3).toLowerCase()] ?? 0;
      day = Number(match[2]);
      year = Number(match[3]);
    } else if (/^[A-Za-z]/.test(match[2]) && match.length >= 4) {
      day = Number(match[1]);
      month = MONTH_MAP[match[2].slice(0, 3).toLowerCase()] ?? 0;
      year = Number(match[3]);
    } else {
      day = Number(match[1]);
      month = Number(match[2]);
      year = Number(match[3]);
    }

    if (year < 100) year += 2000;
    if (month < 1 || month > 12 || day < 1 || day > 31) continue;

    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  const fallback = new Date(s);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback.toISOString().slice(0, 10);
  }

  return "";
}

export function parseAmountFromText(val: string): number {
  const cleaned = String(val)
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : Math.abs(num);
}

function extractDateFromLine(line: string): { date: string; raw: string } | null {
  for (const pattern of DATE_PATTERNS) {
    const match = line.match(pattern);
    if (!match) continue;
    const date = parseDateFromText(match[0]);
    if (date) return { date, raw: match[0] };
  }
  return null;
}

function looksLikeAmountToken(token: string): boolean {
  const t = token.trim();
  if (!t || t.length > 20) return false;
  if (/^\d{10,}$/.test(t.replace(/[^\d]/g, ""))) return false;
  if (!/\d/.test(t)) return false;
  const digitsOnly = t.replace(/[^\d.]/g, "");
  if (!digitsOnly) return false;
  if (/\.\d{2}\b/.test(t) || /(?:₹|Rs|INR|\$)/i.test(t)) return true;
  const n = parseAmountFromText(t);
  return n > 0 && n < 10_000_000 && (t.includes(".") || n >= 1);
}

function pickAmountFromLine(line: string, dateRaw: string): string {
  const withoutDate = line.replace(dateRaw, " ");
  const matches = [...withoutDate.matchAll(AMOUNT_PATTERN)]
    .map((m) => m[0]?.trim() ?? "")
    .filter(looksLikeAmountToken);

  if (matches.length === 0) return "";

  const withDecimals = matches.filter((m) => /\.\d{1,2}\b/.test(m));
  const pool = withDecimals.length > 0 ? withDecimals : matches;
  if (pool.length >= 2) return pool[pool.length - 2] ?? "";
  return pool[pool.length - 1] ?? "";
}

function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 4) return true;
  if (SKIP_LINE.test(trimmed)) return true;
  if (HEADER_HINT.test(trimmed) && !extractDateFromLine(trimmed)) return true;
  return false;
}

function parseLine(line: string): ParsedTransaction | null {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (shouldSkipLine(normalized)) return null;

  const dateInfo = extractDateFromLine(normalized);
  if (!dateInfo) return null;

  const amountRaw = pickAmountFromLine(normalized, dateInfo.raw);
  if (!amountRaw) return null;

  const amount = parseAmountFromText(amountRaw);
  const merchant = normalized
    .replace(dateInfo.raw, " ")
    .replace(amountRaw, " ")
    .replace(AMOUNT_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!merchant || amount <= 0) return null;
  if (merchant.length < 2) return null;

  return { merchant, amount, date: dateInfo.date };
}

function dedupeRows(rows: ParsedTransaction[]): ParsedTransaction[] {
  const seen = new Set<string>();
  const out: ParsedTransaction[] = [];
  for (const row of rows) {
    const key = `${row.date}|${row.amount}|${row.merchant.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

function parseFromLines(text: string): ParsedTransaction[] {
  const lines = normalizeWhitespace(text)
    .split(/\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const rows: ParsedTransaction[] = [];
  let pending: string[] = [];

  const flushPending = () => {
    if (pending.length === 0) return;
    const combined = pending.join(" ");
    const parsed = parseLine(combined);
    if (parsed) rows.push(parsed);
    pending = [];
  };

  for (const line of lines) {
    const tabCells = line.split("\t").map((c) => c.trim()).filter(Boolean);
    if (tabCells.length >= 3) {
      flushPending();
      const fromCells = parseTabularCells(tabCells);
      if (fromCells) rows.push(fromCells);
      continue;
    }

    const parsed = parseLine(line);
    if (parsed) {
      flushPending();
      rows.push(parsed);
      continue;
    }

    if (extractDateFromLine(line) || /\d/.test(line)) {
      pending.push(line);
      if (pending.length > 4) flushPending();
    }
  }

  flushPending();
  return rows;
}

type ColumnMap = {
  date: number;
  merchant: number;
  amount: number;
  debit: number;
  credit: number;
};

function mapTableColumns(headerCells: string[]): ColumnMap | null {
  const normalized = headerCells.map((c) =>
    c.toLowerCase().replace(/\s+/g, " ").trim()
  );

  const cols: ColumnMap = {
    date: -1,
    merchant: -1,
    amount: -1,
    debit: -1,
    credit: -1,
  };

  normalized.forEach((cell, index) => {
    if (cols.date === -1 && /(txn|transaction|posting|value)?\s*date|trans\.?\s*date/.test(cell)) {
      cols.date = index;
    }
    if (
      cols.merchant === -1 &&
      /description|particular|narration|merchant|details|remarks|payee|beneficiary|transaction\s*details/.test(
        cell
      )
    ) {
      cols.merchant = index;
    }
    if (cols.amount === -1 && /^amount$|txn\s*amount|transaction\s*amount/.test(cell)) {
      cols.amount = index;
    }
    if (cols.debit === -1 && /debit|withdrawal|dr\b/.test(cell)) {
      cols.debit = index;
    }
    if (cols.credit === -1 && /credit|deposit|cr\b/.test(cell)) {
      cols.credit = index;
    }
  });

  if (cols.merchant === -1) {
    const candidate = normalized.findIndex(
      (cell, index) =>
        index !== cols.date &&
        index !== cols.amount &&
        index !== cols.debit &&
        index !== cols.credit &&
        cell.length > 3 &&
        !/^\d+$/.test(cell) &&
        !/date|amount|debit|credit|balance|ref/i.test(cell)
    );
    if (candidate >= 0) cols.merchant = candidate;
  }

  const hasAmount = cols.amount >= 0 || cols.debit >= 0 || cols.credit >= 0;
  if (cols.date < 0 || cols.merchant < 0 || !hasAmount) return null;
  return cols;
}

function findHeaderRowIndex(table: string[][]): number {
  const limit = Math.min(6, table.length);
  for (let i = 0; i < limit; i++) {
    const joined = table[i].join(" ").toLowerCase();
    if (HEADER_HINT.test(joined)) return i;
  }
  return -1;
}

function parseTableRow(cells: string[], cols: ColumnMap): ParsedTransaction | null {
  const get = (index: number) => (index >= 0 ? (cells[index] ?? "").trim() : "");

  const dateRaw = get(cols.date);
  const date = parseDateFromText(dateRaw);
  if (!date) return null;

  let amountRaw = get(cols.amount);
  if (!amountRaw) {
    const debit = parseAmountFromText(get(cols.debit));
    const credit = parseAmountFromText(get(cols.credit));
    if (debit > 0) amountRaw = get(cols.debit);
    else if (credit > 0) amountRaw = get(cols.credit);
  }

  const amount = parseAmountFromText(amountRaw);
  const merchant = get(cols.merchant);

  if (!merchant || amount <= 0) return null;
  return { merchant, amount, date };
}

function parseTabularCells(cells: string[]): ParsedTransaction | null {
  if (cells.some((c) => HEADER_HINT.test(c))) return null;

  let dateIdx = -1;
  let amountIdx = -1;

  cells.forEach((cell, index) => {
    if (dateIdx === -1 && parseDateFromText(cell)) dateIdx = index;
    if (looksLikeAmountToken(cell)) amountIdx = index;
  });

  if (dateIdx === -1 || amountIdx === -1) {
    return parseLine(cells.join(" "));
  }

  const date = parseDateFromText(cells[dateIdx]);
  const amount = parseAmountFromText(cells[amountIdx]);
  const merchant = cells
    .filter((_, index) => index !== dateIdx && index !== amountIdx)
    .join(" ")
    .trim();

  if (!date || !merchant || amount <= 0) return null;
  return { merchant, amount, date };
}

function parseFromTables(tables: TableArray[]): ParsedTransaction[] {
  const rows: ParsedTransaction[] = [];

  for (const table of tables) {
    if (!table || table.length === 0) continue;

    const headerIdx = findHeaderRowIndex(table);
    if (headerIdx >= 0) {
      const cols = mapTableColumns(table[headerIdx]);
      if (!cols) continue;
      for (let i = headerIdx + 1; i < table.length; i++) {
        const parsed = parseTableRow(table[i], cols);
        if (parsed) rows.push(parsed);
      }
      continue;
    }

    for (const row of table) {
      const line = row.filter(Boolean).join(" ");
      const parsed = parseLine(line);
      if (parsed) rows.push(parsed);
    }
  }

  return rows;
}

export function parseTransactionsFromPdfContent(
  text: string,
  tables: TableArray[] = []
): ParsedTransaction[] {
  const fromTables = parseFromTables(tables);
  const fromText = parseFromLines(text);

  const combined =
    fromTables.length >= fromText.length ? [...fromTables, ...fromText] : [...fromText, ...fromTables];

  return dedupeRows(combined);
}
