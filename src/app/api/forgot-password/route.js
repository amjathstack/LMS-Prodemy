import crypto from "crypto";
import connectDB from "../../../../config/connectDB";
import userModel from "../../../../models/User";
import { NextResponse } from "next/server";
import { sendResetEmail } from "@/app/lib/sendEmail";

export async function POST(req) {

    const { email } = await req.json();

    await connectDB();

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
        return NextResponse.json({ status: false, message: "If account exists, email sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken = hashToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    try {

        await sendResetEmail(user.email, resetUrl )

    } catch (error) {

        return NextResponse.json({ status: true, message: error.message });

    }



    return NextResponse.json({ status: true, message: "Reset email sent!", resetUrl });

} 