import { NextResponse } from "next/server.js";
import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { redirect } from "next/dist/server/api-utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    //looking for an exisiting user
    const getUser = await sql`SELECT * FROM adminusers WHERE email = ${email};`;

    //if not found...
    if (!getUser.rows[0]) {
      return NextResponse.json(
        { passwordError: "User do not exist,please register" },
        { status: 400 }
      );
    }
    //if found, checking for password match
    const user = getUser.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { passwordError: "Wrong Password,please check" },
        { status: 400 }
      );
    } else {
      //User found with a valid password,creating a new token
      const token = jwt.sign({ email }, process.env.MY_SECRET_TOKEN);
      return NextResponse.json({ token }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
