import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDB();

    // Only include cars with status "Sold"
    const soldCars = await Product.find({ status: "Sold" });

    const totalSold = soldCars.length;
    const totalCost = soldCars.reduce((sum, car) => sum + (car.totalCost || 0), 0);
    const totalSoldPrice = soldCars.reduce((sum, car) => sum + (car.soldPrice || 0), 0);
    const totalProfit = totalSoldPrice - totalCost;

    res.setHeader("Cache-Control", "no-store"); // Disable caching
    return res.status(200).json({
      totalSold,
      totalCost,
      totalSoldPrice,
      totalProfit,
    });
  } catch (err) {
    console.log("[sales-summary_GET]", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}