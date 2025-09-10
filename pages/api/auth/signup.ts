import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/lib/models/User";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ message: "Username or email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    console.log("[signup_POST]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "Signup endpoint" });
}