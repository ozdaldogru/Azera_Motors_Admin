import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";

const formatMonthLabel = (date: Date) =>
  date.toLocaleString("en-US", { month: "short", year: "numeric" });

const getMonthKey = (car: any) => {
  const rawDate = car.soldDate || car.updatedAt || car.createdAt;
  const parsedDate = rawDate ? new Date(rawDate) : null;

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const soldCars = await Product.find({ status: "Sold" });

    const totalSold = soldCars.length;
    const totalCost = soldCars.reduce((sum, car) => sum + (Number(car.totalCost) || 0), 0);
    const totalSoldPrice = soldCars.reduce((sum, car) => sum + (Number(car.soldPrice) || 0), 0);
    const totalProfit = totalSoldPrice - totalCost;

    const monthlyMap = new Map<string, { month: string; label: string; sold: number; cost: number; soldPrice: number; profit: number }>();

    soldCars.forEach((car) => {
      const monthKey = getMonthKey(car);
      if (!monthKey) return;

      const parsedDate = new Date(car.soldDate || car.updatedAt || car.createdAt);
      const existing = monthlyMap.get(monthKey) ?? {
        month: monthKey,
        label: formatMonthLabel(parsedDate),
        sold: 0,
        cost: 0,
        soldPrice: 0,
        profit: 0,
      };

      existing.sold += 1;
      existing.cost += Number(car.totalCost) || 0;
      existing.soldPrice += Number(car.soldPrice) || 0;
      existing.profit = existing.soldPrice - existing.cost;
      monthlyMap.set(monthKey, existing);
    });

    const monthlyProfit = Array.from(monthlyMap.values())
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    return NextResponse.json({
      totalSold,
      totalCost,
      totalSoldPrice,
      totalProfit,
      monthlyProfit,
    });
  } catch (err) {
    console.log("[sales-summary_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};