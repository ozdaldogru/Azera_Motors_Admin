import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ query: string }>}) => {
  const params = await props.params;
  try {
    await connectToDB()

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: params.query, $options: "i" } },
        { make: { $regex: params.query, $options: "i" } },
        { condition: { $regex: params.query, $options: "i" } },
        { driveType: { $regex: params.query, $options: "i" } },
        { fuelType: { $regex: params.query, $options: "i" } },
        { transmission: { $regex: params.query, $options: "i" } },
        { color: { $regex: params.query, $options: "i" } },
        { interiorColor: { $regex: params.query, $options: "i" } },
        { description: { $regex: params.query, $options: "i" } },
        { categories: { $regex: params.query, $options: "i" } },
        { vin: { $regex: params.query, $options: "i" } },

      ]
    })

    return NextResponse.json(searchedProducts, { status: 200 })
  } catch (err) {
    console.log("[search_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
