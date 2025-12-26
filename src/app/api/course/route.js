import { NextResponse } from "next/server";
import connectDB from "../../../../config/connectDB";
import courseModel from "../../../../models/Course";

export async function GET() {
    try {

        await connectDB();
        const response = await courseModel.find()
            .populate("instructorId", "name title bio").populate("comments.userId", "name profileImage");

        return NextResponse.json({ status: true, message: response });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message })

    }
}