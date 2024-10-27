import { NextResponse } from "next/server.js";
import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { redirect } from "next/dist/server/api-utils";

const passwordValidation =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (name.length < 3) {
      return NextResponse.json(
        { nameError: "name is too short" },
        { status: 400 }
      );
    }

    if (!emailValidation.test(email)) {
      return NextResponse.json(
        { emailError: "Invalid Email" },
        { status: 400 }
      );
    }
    if (!passwordValidation.test(password)) {
      return NextResponse.json(
        {
          passwordError:
            "passsword must be 8 character long and contain capital letter,special character and numericals ",
        },
        { status: 400 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const result =
      await sql`SELECT name FROM adminusers WHERE email = ${email};`;
    if (!result.rows[0]) {
      try {
        await sql`INSERT INTO adminusers(name,email,password) VALUES(${name},${email},${passwordHash});`;
        const token = jwt.sign({ email }, process.env.MY_SECRET_TOKEN);
        return NextResponse.json({ token }, { status: 200 }, redirect);
      } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
      }
    } else {
      return NextResponse.json(
        { message: "User already Exists" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
