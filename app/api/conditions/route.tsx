import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Condition from "@/lib/models/Condition";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await connectToDB()

    const { title } = await req.json()

    const existingCondition = await Condition.findOne({ title })

    if (existingCondition) {
      return new NextResponse("Condition is already exists", { status: 400 })
    }

    if (!title ) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const newCondition = await Condition.create({
      title,
 
    })

    await newCondition.save()

    return NextResponse.json(newCondition, { status: 200 })
  } catch (err) {
    console.log("[conditions_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const conditions = await Condition.find().sort({ createdAt: "desc" })

    return NextResponse.json(conditions, { status: 200 })
  } catch (err) {
    console.log("[conditions_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
