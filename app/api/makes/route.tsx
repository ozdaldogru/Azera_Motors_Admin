import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Make from "@/lib/models/Make";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await connectToDB()

    const { title } = await req.json()

    const existingMake = await Make.findOne({ title })

    if (existingMake) {
      return new NextResponse("Make is already exists", { status: 400 })
    }

    if (!title ) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const newMake = await Make.create({
      title,
 
    })

    await newMake.save()

    return NextResponse.json(newMake, { status: 200 })
  } catch (err) {
    console.log("[makes_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const makes = await Make.find().sort({ createdAt: "desc" })

    return NextResponse.json(makes, { status: 200 })
  } catch (err) {
    console.log("[makes_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
