import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAuthUserFromRequest } from "../../auth/getAuthUser";
import { cards } from "../../cards/store";
import { transactions, persistTransactions } from "../store";
import { parseTransactionsFromPdf } from "@/lib/pdfExtract";

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()));
  return { headers, rows };
}

export async function POST(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const cardId = formData.get("cardId");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Missing file" },
        { status: 400 }
      );
    }
    if (!cardId || typeof cardId !== "string" || !cardId.trim()) {
      return NextResponse.json(
        { message: "Missing card" },
        { status: 400 }
      );
    }
    const card = cards.get(cardId.trim());
    if (!card || card.userId !== user.id) {
      return NextResponse.json(
        { message: "Card not found or you don't have access to it" },
        { status: 404 }
      );
    }

    const lowerName = file.name.toLowerCase();
    const isPdf = lowerName.endsWith(".pdf") || file.type === "application/pdf";
    let normalizedRows: Array<{ merchant: string; amount: number; date: string }> = [];

    if (isPdf) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { rows, textLength } = await parseTransactionsFromPdf(buffer);

      if (textLength < 40) {
        return NextResponse.json(
          {
            message:
              "This PDF has little or no readable text (it may be scanned). Export a text-based statement from your bank or upload a CSV.",
          },
          { status: 400 }
        );
      }

      normalizedRows = rows;
      if (normalizedRows.length === 0) {
        return NextResponse.json(
          {
            message:
              "Could not find transactions in this PDF. Try a statement export with date, description, and amount columns, or upload CSV.",
          },
          { status: 400 }
        );
      }
    } else {
      const text = await file.text();
      const { headers, rows } = parseCsv(text);
      const colMerchant = headers.findIndex(
        (h) => h === "merchant" || h === "description" || h === "merchant/description"
      );
      const colAmount = headers.findIndex((h) => h === "amount");
      const colDate = headers.findIndex((h) => h === "date");

      if (colMerchant === -1 || colAmount === -1 || colDate === -1) {
        return NextResponse.json(
          { message: "CSV must have columns: merchant (or description), amount, date" },
          { status: 400 }
        );
      }
      normalizedRows = rows.map((row) => {
        const rawMerchant = row[colMerchant] ?? "";
        const rawAmount = row[colAmount] ?? "";
        const rawDate = row[colDate] ?? "";
        const amount = Number(rawAmount);
        return { merchant: rawMerchant, amount, date: rawDate };
      });
    }

    let imported = 0;
    for (const row of normalizedRows) {
      const rawMerchant = row.merchant ?? "";
      const amount = Number(row.amount);
      const rawDate = row.date ?? "";
      if (rawMerchant === "" || Number.isNaN(amount) || rawDate === "") continue;

      const id = randomBytes(8).toString("hex");
      transactions.set(id, {
        id,
        cardId: cardId.trim(),
        merchant: rawMerchant || null,
        description: null,
        amount,
        currency: "INR",
        date: rawDate,
      });
      imported++;
    }

    persistTransactions();
    return NextResponse.json({ imported });
  } catch (e) {
    console.error("Upload error:", e);
    const message =
      e instanceof Error && /password|encrypted/i.test(e.message)
        ? "This PDF is password-protected. Remove the password and try again."
        : "Upload failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
