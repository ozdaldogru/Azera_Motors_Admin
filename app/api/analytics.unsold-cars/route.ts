import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";

// Returns cars with status 'Sold' but cost, sold price, or sold date is empty or 0
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    // Find cars with status 'Sold' and (totalCost is 0 or null, or soldPrice is 0 or null, or soldDate is empty/null)
    const unsoldInfoCars = await Product.find({
      status: "Sold",
      $or: [
        { totalCost: { $in: [null, 0] } },
        { soldPrice: { $in: [null, 0] } },
        { soldDate: { $in: [null, ""] } },
      ],
    });
    return NextResponse.json(unsoldInfoCars);
  } catch (err) {
    console.log("[unsold-cars_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
