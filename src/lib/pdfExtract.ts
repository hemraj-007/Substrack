import { PDFParse } from "pdf-parse";
import {
  parseTransactionsFromPdfContent,
  type ParsedTransaction,
  type TableArray,
} from "./pdfStatementParser";

export async function extractPdfContent(
  buffer: Buffer
): Promise<{ text: string; tables: TableArray[] }> {
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
