import { NextResponse } from "next/server";
import enrolledCourseModel from "../../../../models/EnrolledCourse";
import connectDB from "../../../../config/connectDB";
import courseModel from "../../../../models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized!" });
        }

        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());

        const price = Number(data.price);
        const lessons = JSON.parse(data.lessons);
        const learningPoints = JSON.parse(data.learningPoints);

        await connectDB();
        const response = await enrolledCourseModel.create({
            ...data,
            price: price,
            studentId: session?.user.id,
            lessons: lessons,
            learningPoints: learningPoints
        });

        const course = await courseModel.findById(data.courseId);
        course.studentsCount += 1;
        await course.save();


        return NextResponse.json({ status: true, message: response })

    } catch (error) {
        console.error("STRIPE ERROR:", error.message);

        return NextResponse.json(
            { status: false, message: error.message }
        );
    }
}


export async function GET() {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized!" });
        }

        await connectDB();
        const response = await enrolledCourseModel
            .find({ studentId: session?.user.id })
            .populate("instructorId", "name")
            .populate("courseId")
            .populate({
                path: "courseId",
                populate: { path: "comments.userId", select: "name profileImage" }
            });

        if (response) {
            return NextResponse.json({ status: true, message: response || [] });
        }

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }
}

export async function PUT(request) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "UnAuthorized!" });
        }

        const body = await request.json();
        const { courseId, lessons } = body;

        const response = await enrolledCourseModel.findByIdAndUpdate(courseId, { lessons }, { new: true });

        return NextResponse.json({ status: true, message: response });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }
}