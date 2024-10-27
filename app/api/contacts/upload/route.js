import { sql } from "@vercel/postgres";

import { NextResponse } from "next/server";
import { userValidation, validation } from "@/app/middleware";

export async function POST(req) {
  const { isUserValid, authError } = await userValidation();
  if (!isUserValid) {
    return NextResponse.json(
      { message: authError, ok: false },
      { status: 401 }
    );
  }
  const body = await req.json();
  for (let contact of body) {
    const { valid, verfiedBody, error } = await validation(contact);
    if (!valid) {
      return NextResponse.json({ contact, error }, { status: 400 });
    } else {
      const {
        contactName,
        contactEmailAddress,
        contactPhoneNumber,
        contactAddress,
        createdDate,
      } = verfiedBody;
      await sql`INSERT INTO 
              contacts(contact_name,contact_email,contact_phone,contact_address,contact_timezone) 
              VALUES(${contactName},${contactEmailAddress},${contactPhoneNumber},${contactAddress},${createdDate});`;
    }
  }
  return NextResponse.json(body, { status: 200 });
}
