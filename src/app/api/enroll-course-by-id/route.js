import { NextResponse } from "next/server";
import enrolledCourseModel from "../../../../models/EnrolledCourse";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "UnAuthorized!" });
        }

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId");

        const response = await enrolledCourseModel
            .findOne({ courseId, studentId: session?.user?.id })
            .populate("instructorId")
            .populate("courseId")
            .populate({
                path: "courseId",
                populate: { path: "comments.userId", select: "name profileImage" }
            });

        return NextResponse.json({ status: true, message: response });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }
}