import { NextResponse } from "next/server";
import courseModel from "../../../../models/Course";
import enrolledCourseModel from "../../../../models/EnrolledCourse";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "../../../../config/connectDB";

export async function GET(request) {
    try {

        const session = await getServerSession(authOptions);

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId");

        await connectDB();
        const response = await courseModel.findById(courseId).populate("instructorId").populate("comments.userId", "name profileImage");

        const isCourseEnrolled = await enrolledCourseModel.findOne({ courseId, studentId: session?.user.id })

        return NextResponse.json({
            status: true, message: {
                courseDetails: response,
                isCourseEnrolled
            }
        })

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message })

    }
}