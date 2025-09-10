import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Make from "@/lib/models/Make";


export const GET = async (req: NextRequest, props: { params: Promise<{ makeId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const make = await Make.findById(params.makeId);

    if (!make) {
      return new NextResponse(
        JSON.stringify({ message: "Make not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(make, { status: 200 });
  } catch (err) {
    console.log("[makeId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ makeId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    let make = await Make.findById(params.makeId);

    if (!make) {
      return new NextResponse("Make not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    make = await Make.findByIdAndUpdate(
      params.makeId,
      { title },
      { new: true }
    );

    await make.save();

    return NextResponse.json(make, { status: 200 });
  } catch (err) {
    console.log("[makeId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ makeId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    await Make.findByIdAndDelete(params.makeId);
   
    return new NextResponse("Make is deleted", { status: 200 });
  } catch (err) {
    console.log("[makeId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
