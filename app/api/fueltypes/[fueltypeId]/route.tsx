import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import FuelType from "@/lib/models/FuelType";


export const GET = async (req: NextRequest, props: { params: Promise<{ fueltypeId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const fueltype = await FuelType.findById(params.fueltypeId);

    if (!fueltype) {
      return new NextResponse(
        JSON.stringify({ message: "FuelType not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(fueltype, { status: 200 });
  } catch (err) {
    console.log("[fueltypeId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ fueltypeId: string }> }) => {
  const params = await props.params;
  try {
    const  userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let fueltype = await FuelType.findById(params.fueltypeId);

    if (!fueltype) {
      return new NextResponse("FuelType not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    fueltype = await FuelType.findByIdAndUpdate(
      params.fueltypeId,
      { title },
      { new: true }
    );

    await fueltype.save();

    return NextResponse.json(fueltype, { status: 200 });
  } catch (err) {
    console.log("[fueltypeId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ fueltypeId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await FuelType.findByIdAndDelete(params.fueltypeId);
   
    return new NextResponse("FuelType is deleted", { status: 200 });
  } catch (err) {
    console.log("[fueltypeId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
