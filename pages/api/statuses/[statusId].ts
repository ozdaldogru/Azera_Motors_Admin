import { connectToDB } from "@/lib/mongoDB";
import Status from "@/lib/models/Status";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();
  const { statusId } = req.query;

  if (req.method === "GET") {
    try {
      const status = await Status.findById(statusId);
      if (!status) {
        return res.status(404).json({ message: "Status not found" });
      }
      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json(status);
    } catch (err) {
      console.log("[statusId_GET]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "POST") {
    try {
      let status = await Status.findById(statusId);
      if (!status) {
        return res.status(404).json({ error: "Status not found" });
      }

      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      status = await Status.findByIdAndUpdate(
        statusId,
        { title },
        { new: true }
      );

      await status.save();
      return res.status(200).json(status);
    } catch (err) {
      console.log("[statusId_POST]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Status.findByIdAndDelete(statusId);
      return res.status(200).json({ message: "Status is deleted" });
    } catch (err) {
      console.log("[statusId_DELETE]", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
