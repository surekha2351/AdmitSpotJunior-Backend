import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { userValidation, validation } from "@/app/middleware";

export async function POST(req) {
  try {
    const { isUserValid, authError } = await userValidation();
    if (!isUserValid) {
      return NextResponse.json(authError, { status: 401 });
    }
    const body = await req.json();
    const { valid, verfiedBody, error } = await validation(body);
    if (!valid) {
      return NextResponse.json(error.message, { status: 400 });
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
      return NextResponse.json(
        { message: "Inserted Successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
