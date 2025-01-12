import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Condition from "@/lib/models/Condition";


export const GET = async (req: NextRequest, props: { params: Promise<{ conditionId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const condition = await Condition.findById(params.conditionId);

    if (!condition) {
      return new NextResponse(
        JSON.stringify({ message: "Condition not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(condition, { status: 200 });
  } catch (err) {
    console.log("[conditionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ conditionId: string }> }) => {
  const params = await props.params;
  try {
    const  userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let condition = await Condition.findById(params.conditionId);

    if (!condition) {
      return new NextResponse("Condition not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    condition = await Condition.findByIdAndUpdate(
      params.conditionId,
      { title },
      { new: true }
    );

    await condition.save();

    return NextResponse.json(condition, { status: 200 });
  } catch (err) {
    console.log("[conditionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ conditionId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Condition.findByIdAndDelete(params.conditionId);
   
    return new NextResponse("Condition is deleted", { status: 200 });
  } catch (err) {
    console.log("[conditionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
