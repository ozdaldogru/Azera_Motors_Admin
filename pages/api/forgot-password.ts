import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "POST") {
    const { email, token, newPassword } = req.body;

    // 1. Request password reset (send email)
    if (email && !token && !newPassword) {
      const user = await User.findOne({ email });
      if (!user || !user.email) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      await transporter.sendMail({
        from: `"Azera Motors" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset.</p>
          <p>Click <a href="http://localhost:3000/reset-password?token=${resetToken}">here</a> to reset your password.</p>
          <p>This link will expire in 1 hour.</p>
        `,
      });

      return res.status(200).json({ message: "Recovery email sent" });
    }

    // 2. Handle password reset (with token)
    if (token && newPassword) {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) return res.status(400).json({ error: "Invalid or expired token" });

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(200).json({ message: "Password updated" });
    }

    return res.status(400).json({ error: "Invalid request" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}