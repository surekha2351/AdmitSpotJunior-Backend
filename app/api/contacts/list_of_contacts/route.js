import { userValidation } from "@/app/middleware";
import { sql } from "@vercel/postgres";

import { NextResponse } from "next/server";

export async function GET() {
  const { isUserValid, authError } = await userValidation();
  if (!isUserValid) {
    return NextResponse.json(
      { message: authError, ok: false },
      { status: 401 }
    );
  }
  const listOfContacts = await sql`SELECT * FROM contacts`;
  if (!listOfContacts.rows.length) {
    return NextResponse.json(
      { message: "list of contacts is Empty" },
      { status: 400 }
    );
  } else {
    return NextResponse.json(
      { list_of_contacts: listOfContacts.rows, ok: true },
      { status: 200 }
    );
  }
}
