import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    // Only include cars with status "sold"
    const soldCars = await Product.find({ status: "Sold" });

    const totalSold = soldCars.length; // Number of sold cars
    const totalCost = soldCars.reduce((sum, car) => sum + (car.totalCost || 0), 0);
    const totalSoldPrice = soldCars.reduce((sum, car) => sum + (car.soldPrice || 0), 0);
    const totalProfit = totalSoldPrice - totalCost;

    return NextResponse.json({
      totalSold,
      totalCost,
      totalSoldPrice,
      totalProfit,
    });
  } catch (err) {
    console.log("[sales-summary_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};