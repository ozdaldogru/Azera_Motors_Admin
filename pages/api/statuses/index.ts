import { connectToDB } from "@/lib/mongoDB";
import Status from "@/lib/models/Status";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const existingStatus = await Status.findOne({ title });
      if (existingStatus) {
        return res.status(400).json({ error: "Status already exists" });
      }

      const newStatus = await Status.create({ title });
      await newStatus.save();

      return res.status(200).json(newStatus);
    } catch (err) {
      console.log("[statuses_POST]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const statuses = await Status.find().sort({ createdAt: "desc" });
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(statuses);
    } catch (err) {
      console.log("[statuses_GET]", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
