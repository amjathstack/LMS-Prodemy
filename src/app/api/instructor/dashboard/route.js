import { NextResponse } from "next/server";
import courseModel from "../../../../../models/Course";
import userModel from "../../../../../models/User";
import enrolledCourseModel from "../../../../../models/EnrolledCourse";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "../../../../../config/connectDB";
import { getServerSession } from "next-auth";

export async function GET() {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized" })
        }

        const instructorId = session.user.id;

        await connectDB();

        const totalCourses = await courseModel.find({ instructorId });
        const totalReviews = totalCourses.reduce((total, item) => total + (item?.comments?.length || 0), 0);

        const user = await userModel.findById(instructorId);
        const totalEarnings = user?.earnings || 0;

        const enrollments = await enrolledCourseModel.find({ instructorId }).populate("studentId");

        const totalStudents = Array.from(
            new Map(
                enrollments
                    .filter(e => e.studentId)
                    .map(e => [e.studentId._id.toString(), { title: e.title, user: e.studentId }])
            ).values()
        );

        const recentStudents = totalStudents.slice(0, 3);

        const recentCourses = await courseModel
            .find({ instructorId })
            .sort({ createdAt: -1 })
            .limit(3)

        return NextResponse.json({
            status: true,
            message: {
                totalStudents,
                totalReviews,
                totalEarnings,
                totalCourses,
                recentCourses,
                recentStudents
            },
        });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
