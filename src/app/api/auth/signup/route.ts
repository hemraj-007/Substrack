import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { users, tokens } from "../store";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function createToken(): string {
  return randomBytes(32).toString("hex");
}

function now(): string {
  return new Date().toISOString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (users.has(normalizedEmail)) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }
    const id = randomBytes(8).toString("hex");
    const user = {
      id,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      createdAt: now(),
      updatedAt: now(),
    };
    users.set(normalizedEmail, user);
    const token = createToken();
    tokens.set(token, normalizedEmail);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        plan: "free",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
