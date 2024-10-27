import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { userValidation, validation } from "@/app/middleware";

export async function GET(req, { params }) {
  const { isUserValid, authError } = await userValidation();
  if (!isUserValid) {
    return NextResponse.json(
      { message: authError, ok: false },
      { status: 401 }
    );
  }
  try {
    const idObj = await params;
    const { id } = idObj;
    const contactObjQuery =
      await sql`SELECT * FROM contacts WHERE contact_id=${id}`;
    const contactObj = contactObjQuery.rows[0];
    return NextResponse.json(contactObj, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { isUserValid, authError } = await userValidation();
  if (!isUserValid) {
    return NextResponse.json(
      { message: authError, ok: false },
      { status: 401 }
    );
  }
  const { valid, body, error } = await validation(req);
  if (!valid) {
    return NextResponse.json(error.message, { status: 400 });
  } else {
    const idObj = await params;
    const { id } = idObj;
    const {
      contactName,
      contactEmailAddress,
      contactPhoneNumber,
      contactAddress,
      createdDate,
    } = body;

    try {
      await sql`UPDATE contacts SET 
        contact_name=${contactName},
         contact_email=${contactEmailAddress},
          contact_phone=${contactPhoneNumber},
           contact_address=${contactAddress},
           contact_timezone=${createdDate} WHERE contact_id=${id};`;
      return NextResponse.json(
        { message: "inserted successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(error, { status: 500 });
    }
  }
}
