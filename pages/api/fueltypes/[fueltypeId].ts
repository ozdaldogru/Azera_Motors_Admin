import { connectToDB } from "@/lib/mongoDB";
import FuelType from "@/lib/models/FuelType";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();
  const { fueltypeId } = req.query;

  if (req.method === "GET") {
    try {
      const fueltype = await FuelType.findById(fueltypeId);
      if (!fueltype) {
        return res.status(404).json({ message: "FuelType not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(fueltype);
    } catch (err) {
      console.log("[fueltypeId_GET]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "POST") {
    try {
      let fueltype = await FuelType.findById(fueltypeId);
      if (!fueltype) {
        return res.status(404).json({ error: "FuelType not found" });
      }

      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      fueltype = await FuelType.findByIdAndUpdate(
        fueltypeId,
        { title },
        { new: true }
      );

      await fueltype.save();
      return res.status(200).json(fueltype);
    } catch (err) {
      console.log("[fueltypeId_POST]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await FuelType.findByIdAndDelete(fueltypeId);
      return res.status(200).json({ message: "FuelType is deleted" });
    } catch (err) {
      console.log("[fueltypeId_DELETE]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
