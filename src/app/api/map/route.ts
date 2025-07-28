import { NextResponse } from "next/server";

export const GET = async () => {
  const apiKey = process.env.MAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "کلید API یافت نشد" }, { status: 500 });
  }

  return NextResponse.json({ apiKey });
};
