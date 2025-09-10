import { connectToDB } from "@/lib/mongoDB";
import DriveType from "@/lib/models/DriveType";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();
  const { drivetypeId } = req.query;

  if (req.method === "GET") {
    try {
      const drivetype = await DriveType.findById(drivetypeId);
      if (!drivetype) {
        return res.status(404).json({ message: "DriveType not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(drivetype);
    } catch (err) {
      console.log("[drivetypeId_GET]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "POST") {
    try {
      let drivetype = await DriveType.findById(drivetypeId);
      if (!drivetype) {
        return res.status(404).json({ error: "DriveType not found" });
      }

      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      drivetype = await DriveType.findByIdAndUpdate(
        drivetypeId,
        { title },
        { new: true }
      );

      await drivetype.save();
      return res.status(200).json(drivetype);
    } catch (err) {
      console.log("[drivetypeId_POST]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await DriveType.findByIdAndDelete(drivetypeId);
      return res.status(200).json({ message: "DriveType is deleted" });
    } catch (err) {
      console.log("[drivetypeId_DELETE]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
