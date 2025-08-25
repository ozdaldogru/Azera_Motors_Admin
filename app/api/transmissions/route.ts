import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Transmission from "@/lib/models/Transmission";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await connectToDB()

    const { title } = await req.json()

    const existingTransmission = await Transmission.findOne({ title })

    if (existingTransmission) {
      return new NextResponse("Transmission is already exists", { status: 400 })
    }

    if (!title ) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const newTransmission = await Transmission.create({
      title,
 
    })

    await newTransmission.save()

    return NextResponse.json(newTransmission, { status: 200 })
  } catch (err) {
    console.log("[transmissions_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const transmissions = await Transmission.find().sort({ createdAt: "desc" })

    return NextResponse.json(transmissions, { status: 200 })
  } catch (err) {
    console.log("[transmissions_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
