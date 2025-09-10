import { connectToDB } from "@/lib/mongoDB";
import DriveType from "@/lib/models/DriveType";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const drivetypes = await DriveType.find().sort({ createdAt: "desc" });
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(drivetypes);
    } catch (err) {
      console.log("[drivetypes_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const existingDriveType = await DriveType.findOne({ title });
      if (existingDriveType) {
        return res.status(400).json({ error: "DriveType already exists" });
      }

      const newDriveType = await DriveType.create({ title });
      await newDriveType.save();

      return res.status(200).json(newDriveType);
    } catch (err) {
      console.log("[drivetypes_POST]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
