import {
  parseTransactionsFromPdfContent,
  type ParsedTransaction,
  type TableArray,
} from "./pdfStatementParser";

function ensurePdfRuntimePolyfills(): void {
  const g = globalThis as typeof globalThis & {
    DOMMatrix?: typeof DOMMatrix;
    ImageData?: typeof ImageData;
    Path2D?: typeof Path2D;
  };

  if (typeof g.DOMMatrix === "undefined") {
    g.DOMMatrix = class DOMMatrix {} as unknown as typeof DOMMatrix;
  }
  if (typeof g.ImageData === "undefined") {
    g.ImageData = class ImageData {} as unknown as typeof ImageData;
  }
  if (typeof g.Path2D === "undefined") {
    g.Path2D = class Path2D {} as unknown as typeof Path2D;
  }
}

export async function extractPdfContent(
  buffer: Buffer
): Promise<{ text: string; tables: TableArray[] }> {
  ensurePdfRuntimePolyfills();
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const textResult = await parser.getText({
      lineEnforce: true,
      cellSeparator: "\t",
      lineThreshold: 5,
      cellThreshold: 6,
      pageJoiner: "\n",
    });

    let tables: TableArray[] = [];
    try {
      const tableResult = await parser.getTable();
      tables = tableResult.mergedTables ?? [];
    } catch {
      tables = [];
    }

    return {
      text: textResult.text ?? "",
      tables,
    };
  } finally {
    await parser.destroy();
  }
}

export async function parseTransactionsFromPdf(
  buffer: Buffer
): Promise<{ rows: ParsedTransaction[]; textLength: number }> {
  const { text, tables } = await extractPdfContent(buffer);
  const rows = parseTransactionsFromPdfContent(text, tables);
  return { rows, textLength: text.replace(/\s/g, "").length };
}
