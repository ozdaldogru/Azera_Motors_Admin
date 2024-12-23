import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Feature from "@/lib/models/Feature";
import Product from "@/lib/models/Product";

export const GET = async (req: NextRequest, props: { params: Promise<{ featureId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const feature = await Feature.findById(params.featureId).populate({ path: "products", model: Product });

    if (!feature) {
      return new NextResponse(
        JSON.stringify({ message: "Feature not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(feature, { status: 200 });
  } catch (err) {
    console.log("[featureId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ featureId: string }> }) => {
  const params = await props.params;
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let feature = await Feature.findById(params.featureId);

    if (!feature) {
      return new NextResponse("Feature not found", { status: 404 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    feature = await Feature.findByIdAndUpdate(
      params.featureId,
      { title },
      { new: true }
    );

    await feature.save();

    return NextResponse.json(feature, { status: 200 });
  } catch (err) {
    console.log("[featureId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ featureId: string }> }) => {
  const params = await props.params;
  try {
    const  {userId}  = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Feature.findByIdAndDelete(params.featureId);

    await Product.updateMany(
      { features: params.featureId },
      { $pull: { features: params.featureId } }
    );
    
    return new NextResponse("Feature is deleted", { status: 200 });
  } catch (err) {
    console.log("[featureId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
