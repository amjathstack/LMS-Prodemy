import bcrypt from "bcrypt";
import crypto from "crypto";
import connectDB from "../../../../config/connectDB";
import userModel from "../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { token, password } = await req.json();

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    await connectDB();

    console.log(hashedToken)

    const user = await userModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return NextResponse.json(
            { status: false, message: "Token invalid or expired" }
        );
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({ status: true, message: "Password updated successfully" });
}
