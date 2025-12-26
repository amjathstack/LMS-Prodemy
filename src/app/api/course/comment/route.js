import { NextResponse } from "next/server";
import connectDB from "../../../../../config/connectDB";
import courseModel from "../../../../../models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        await connectDB();
        const { courseId, rating, comment } = await req.json();

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized!" });
        }

        if (!session?.user.id || !comment) {
            return NextResponse.json({ status: false, message: "User ID and comment are required" });
        }

        const course = await courseModel.findById(courseId);
        if (!course) {
            return NextResponse.json({ status: false, message: "Course not found" });
        }

        course.comments.push({ userId: session?.user.id, rating, comment });
        await course.save();

        const updatedCourse = await courseModel.findById(courseId)
            .populate("comments.userId", "name profileImage");

        return NextResponse.json({ status: true, message: updatedCourse.comments });

    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}