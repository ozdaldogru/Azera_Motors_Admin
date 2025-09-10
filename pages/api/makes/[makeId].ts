import { connectToDB } from "@/lib/mongoDB";
import Make from "@/lib/models/Make";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();
  const { makeId } = req.query;

  if (req.method === "GET") {
    try {
      const make = await Make.findById(makeId);
      if (!make) {
        return res.status(404).json({ message: "Make not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(make);
    } catch (err) {
      console.log("[makeId_GET]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "POST") {
    try {
      let make = await Make.findById(makeId);
      if (!make) {
        return res.status(404).json({ error: "Make not found" });
      }

      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      make = await Make.findByIdAndUpdate(
        makeId,
        { title },
        { new: true }
      );

      await make.save();
      return res.status(200).json(make);
    } catch (err) {
      console.log("[makeId_POST]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Make.findByIdAndDelete(makeId);
      return res.status(200).json({ message: "Make is deleted" });
    } catch (err) {
      console.log("[makeId_DELETE]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
