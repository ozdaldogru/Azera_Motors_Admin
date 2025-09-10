import { connectToDB } from "@/lib/mongoDB";
import Transmission from "@/lib/models/Transmission";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();
  const { transmissionId } = req.query;

  if (req.method === "GET") {
    try {
      const transmission = await Transmission.findById(transmissionId);
      if (!transmission) {
        return res.status(404).json({ message: "Transmission not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(transmission);
    } catch (err) {
      console.log("[transmissionId_GET]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "POST") {
    try {
      let transmission = await Transmission.findById(transmissionId);
      if (!transmission) {
        return res.status(404).json({ error: "Transmission not found" });
      }

      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      transmission = await Transmission.findByIdAndUpdate(
        transmissionId,
        { title },
        { new: true }
      );

      await transmission.save();
      return res.status(200).json(transmission);
    } catch (err) {
      console.log("[transmissionId_POST]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Transmission.findByIdAndDelete(transmissionId);
      return res.status(200).json({ message: "Transmission is deleted" });
    } catch (err) {
      console.log("[transmissionId_DELETE]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
